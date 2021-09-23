<template>
	<q-page>
		<div class="mt-20 text-4xl text-center font-black text-MedRx_theme">Sign Up</div>
		<!-- Basic details Submission -->
		<div v-if="pageNum === 0">
			<div
				class="px-10 text-h6 font-bold text-center"
			>Let's get you started for your MedRx account first.</div>
			<q-item-label overline class="px-10 my-4 font-black">PERSONAL INFORMATION</q-item-label>
			<div class="gap-4 px-10 grid-cols-2 grid">
				<div>
					<!-- <div class="mt-5 mb-1 text-sm font-semibold">First Name</div> -->
					<q-input
						v-model="firstName"
						dense
						outlined
						label="First Name"
						placeholder="John"
						lazy-rules
						:rules="firstNameRules"
						class="w-full"
					/>
				</div>
				<div>
					<!-- <div class="mt-5 mb-1 text-sm font-semibold">Middle Name (Optional)</div> -->
					<q-input
						v-model="middleName"
						dense
						outlined
						label="Middle Name (Optional)"
						placeholder="Nathan"
						class="w-full"
					/>
				</div>
			</div>
			<div class="gap-4 px-10 grid-cols-2 grid">
				<div>
					<!-- <div class="mt-5 mb-1 text-sm font-semibold">Last Name</div> -->
					<q-input
						v-model="lastName"
						dense
						outlined
						label="Last Name"
						placeholder="Doe"
						lazy-rules
						:rules="lastNameRules"
						class="w-full"
					/>
				</div>
			</div>
			<q-item-label overline class="px-10 my-4 font-black">CREDENTIALS</q-item-label>
			<div class="px-10">
				<div>
					<!-- <div class="mt-5 mb-1 text-sm font-semibold">E-mail Address</div> -->
					<div>
						<q-input
							v-model="email"
							dense
							outlined
							label="E-mail Address"
							placeholder="address@email.com"
							lazy-rules
							:rules="emailRules"
						/>
					</div>
				</div>
				<div>
					<!-- <div class="mt-5 mb-1 text-sm font-semibold">Password</div> -->
					<div>
						<q-input
							v-model="password"
							dense
							outlined
							label="Password"
							placeholder="4_v3ry_s3cvr3_p@ssw0rd"
							:type="isPwd ? 'password' : 'text'"
							lazy-rules
							:rules="passwordRules"
						>
							<template v-slot:append>
								<q-icon
									:name="isPwd ? 'visibility_off' : 'visibility'"
									class="cursor-pointer"
									@click="isPwd = !isPwd"
								/>
							</template>
						</q-input>
					</div>
				</div>
			</div>
			<q-item-label overline class="px-10 my-4 font-black">GENERAL LOCATION</q-item-label>
			<location-selector class="mb-4" @input="updateLocations" />
			<div align="right" class="px-10">
				<q-btn
					@click="validate()"
					rounded
					unelevated
					color="none"
					label="Continue"
					class="px-8 py-2 font-black bg-gradient-to-tr from-medrx to-green-200"
				/>
			</div>
		</div>
		<!-- Mobile Nuber Submission -->
		<div v-else-if="pageNum === 1">
			<div class="px-10 text-sm font-semibold">We need your number to verify your identity.</div>
			<div class="gap-4 px-10 grid-cols-1 grid">
				<div class="mt-5 font-semibold">Mobile Number</div>
				<div>
					<q-input
						v-model="mobileNumber"
						dense
						outlined
						label="+639123456789"
						lazy-rules
						:rules="numberRules"
					/>
				</div>
				<div>
					<q-btn
						@click="validate()"
						rounded
						unelevated
						color="none"
						label="Continue"
						class="px-8 py-2 font-black bg-gradient-to-tr from-medrx to-green-200"
					/>
				</div>
			</div>
		</div>
		<!-- Verification Code Submission -->
		<div v-else-if="pageNum === 2">
			<div class="mt-20 px-10 text-4xl font-black text-MedRx_theme">Almost there!</div>
			<div class="px-10 text-sm font-semibold">Enter the code sent to {{ mobileNumber }}.</div>
			<div class="gap-4 px-10 grid-cols-1 grid">
				<div class="mt-3">
					<q-input
						class="text-3xl"
						style="max-width:100px"
						v-model="verificationCode"
						dense
						outlined
						label="1234"
					/>
				</div>
				<div>
					<q-btn
						class="mt-3 w-full md:w-3/4 lg:w-3/5 py-4"
						color="primary"
						label="Continue"
						@click="validateThree()"
					/>
				</div>
				<div align="right" class="font-semibold">Didn't receive a code?</div>
				<div align="right">
					<q-btn
						no-caps
						:disabled="countDownDone"
						@click="countDown()"
						color="primary"
						label="Send a new code "
					>({{ timer }}s)</q-btn>
				</div>
			</div>
		</div>
		<div id="verify"></div>
	</q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar'
import { linkWithPhoneNumber, RecaptchaVerifier, getAuth, ConfirmationResult } from 'firebase/auth'
import { register } from 'src/api/firebase';
import { useRouter } from 'vue-router';
import LocationSelector from 'src/components/LocationSelector.vue'

export default defineComponent({
	name: 'Register',
	components: { LocationSelector },
	setup() {
		const quasar = useQuasar();
		const router = useRouter();
		const pageNum = ref(0);

		// Register 1
		const email = ref('');
		const password = ref('');
		const firstName = ref('');
		const middleName = ref('');
		const lastName = ref('');
		const locations = ref({ city: '', region: '' });
		const isPwd = ref(true);

		// Register 2
		const mobileNumber = ref('');

		// Register 3
		const verificationCode = ref('');
		const confirmationResult = ref<ConfirmationResult>(null as unknown as ConfirmationResult);
		const timer = ref(0);
		const countDownDone = ref(false);

		const recaptchaVerifier = ref(null as unknown as RecaptchaVerifier);

		const updateLocations = (val: { city: string, region: string }) => {
			locations.value = { ...val }
		}

		onMounted(() => {
			recaptchaVerifier.value = new RecaptchaVerifier('verify', { size: 'invisible' }, getAuth())
			console.log('Verifier mounted: ', recaptchaVerifier.value)
		})

		watch(pageNum, async (newPageNum) => {
			if (newPageNum === 2) {
				quasar.loading.show();
				const auth = getAuth();

				if (auth.currentUser) {
					confirmationResult.value = await linkWithPhoneNumber(auth.currentUser, mobileNumber.value, recaptchaVerifier.value);
					console.log('OTP code sent')
				} else {
					quasar.notify({ type: 'negative', message: 'Something went wrong with the registration. Please restart MedRx and try again.' })
				}

				quasar.loading.hide();
			}
		})

		const validate = async () => {
			if (email.value, password.value, firstName.value, lastName.value && locations.value.city && locations.value.region) {
				if (await signUp()) {
					pageNum.value = 1;
				} else {
					// TODO: Something terrible has happened.
				}
			} else {
				quasar.notify('Please fill up the necessary fields.')
			}
		}

		const validateTwo = () => {
			if (mobileNumber.value) {
				pageNum.value = 2
				countDown()
			} else {
				quasar.notify('Please enter your mobile number.')
			}
		}


		const validateThree = async () => {
			try {
				quasar.loading.show();
				await confirmationResult.value.confirm(verificationCode.value)
				console.log('Phone numbers linked!')
				router.push('/home')
			} catch (err) {
				quasar.notify({ type: 'negative', message: 'The code was invalid. Try again!' })
			} finally {
				quasar.loading.hide();
			}
		}

		const signUp = async () => {
			const recaptchaToken = await recaptchaVerifier.value.verify();
			console.log(recaptchaToken)
			return await register(email.value, password.value, firstName.value, middleName.value, lastName.value, locations.value);
		}

		const countDown = () => {
			timer.value = 25
			countDownDone.value = true

			const interv = setInterval(function () {
				if (timer.value !== 0) {
					timer.value--
				} else {
					countDownDone.value = false
					clearInterval(interv)
				}
				console.log(timer.value)
			}, 1000);
		}

		return {
			// Rules
			emailRules: [
				(val: string) => (val && val.length > 0 && val.includes('@') && val.includes('.')) || 'Please enter a valid email address'
			],
			passwordRules: [
				(val: string) => (val && val.length > 5) || 'Password must be 6 or more characters long'
			],
			firstNameRules: [
				(val: string) => (val && val.length > 0) || 'Please enter your first name'
			],
			lastNameRules: [
				(val: string) => (val && val.length > 0) || 'Please enter your last name'
			],
			numberRules: [
				(val: string) => (val && val.length === 13 && val.includes('+639')) || 'Please enter a valid phone number'
			],

			// Form fields
			email,
			password,
			firstName,
			middleName,
			lastName,
			verificationCode,
			mobileNumber,

			// Functions
			validate,
			validateTwo,
			validateThree,
			countDown,
			updateLocations,

			// Plain values
			isPwd,
			pageNum,
			countDownDone,
			timer,

		}
	}
})
</script>


 