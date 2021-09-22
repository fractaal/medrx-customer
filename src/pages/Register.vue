<template>
	<q-page>
		<div class="mt-20 text-4xl text-center font-black text-MedRx_theme">Sign Up</div>
		<!-- Basic details Submission -->
		<div v-if="pageNum === 0">
			<div
				class="mt-10 px-10 text-sm font-semibold"
			>Let's get you started for your MedRx account first.</div>
			<div class="gap-4 px-10 grid-cols-2 grid">
				<div>
					<div class="mt-5 mb-1 text-sm font-semibold">First Name</div>
					<div style="max-width: 200px">
						<q-input v-model="firstName" dense outlined label="John" lazy-rules :rules="firstNameRules" />
					</div>
				</div>
				<div>
					<div class="mt-5 mb-1 text-sm font-semibold">Middle Name (Optional)</div>
					<div style="max-width: 200px">
						<q-input v-model="middleName" dense outlined label="Nathan" />
					</div>
				</div>
			</div>
			<div class="gap-4 px-10 grid-cols-2 grid">
				<div>
					<div class="mt-5 mb-1 text-sm font-semibold">Last Name</div>
					<div style="max-width: 200px">
						<q-input v-model="lastName" dense outlined label="Doe" lazy-rules :rules="lastNameRules" />
					</div>
				</div>
			</div>
			<div class="gap-4 px-10 grid-cols-1 grid">
				<div>
					<div class="mt-5 mb-1 text-sm font-semibold">E-mail Address</div>
					<div>
						<q-input
							v-model="email"
							dense
							outlined
							label="youremail@email.com"
							lazy-rules
							:rules="emailRules"
						/>
					</div>
				</div>
			</div>
			<div class="gap-4 px-10 grid-cols-1 grid">
				<div>
					<div class="mt-5 mb-1 text-sm font-semibold">Password</div>
					<div>
						<q-input
							v-model="password"
							dense
							outlined
							label="Password123"
							:type="isPwd ? 'password' : 'text'"
							lazy-rules
							:rules="passwordRules"
						>
							<template v-slot:append>
								<q-icon
									:name="isPwd ? 'visibility_off' : 'visibility'"
									class="cursor-pointer"
									@click.prevent="isPwd = !isPwd"
								/>
							</template>
						</q-input>
					</div>
				</div>
			</div>
			<div class="gap-4 px-10 mt-3 grid-cols-2 grid">
				<div />
				<div align="right">
					<q-btn @click.prevent="validate()" color="primary" label="Continue" />
				</div>
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
						class="mt-7 w-full md:w-3/4 lg:w-3/5 py-4"
						@click.prevent="validateTwo()"
						color="primary"
						label="Continue"
					/>
				</div>
			</div>
		</div>
		<!-- Verification Code Submission -->
		<div v-else-if="pageNum === 2">
			<div class="mt-20 px-10 text-4xl font-black text-MedRx_theme">Almost there!</div>
			<div class="px-10 text-sm font-semibold">Enter the code sent to {{ mobileNumber }}</div>
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
						@click.prevent="validateThree()"
					/>
				</div>
				<div align="right" class="font-semibold">Didn't receive a code?</div>
				<div align="right">
					<q-btn
						no-caps
						:disabled="countDownDone"
						@click.prevent="countDown()"
						color="primary"
						label="Send a new code "
					>({{ timer }}s)</q-btn>
				</div>
			</div>
		</div>
	</q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { Notify } from 'quasar'
import { PhoneAuthProvider, linkWithCredential, RecaptchaVerifier } from "firebase/auth"
import { register } from 'src/api/firebase';

export default defineComponent({
	setup() {
		const pageNum = ref(0);

		// Register 1
		const email = ref('');
		const password = ref('');
		const firstName = ref('');
		const middleName = ref('');
		const lastName = ref('');
		const isPwd = ref(true);


		// Register 2
		const mobileNumber = ref('');

		// Register 3
		const verificationCode = ref('');
		const timer = ref('');
		const countDownDone = ref('');

		const validate = async () => {
			if (email.value, password.value, firstName.value, lastName.value) {
				if (await signUp()) {
					pageNum.value = 1;
				} else {
					// Something terrible has happened.
				}
			} else {
				Notify.create('Please fill up the necessary fields.')
			}
		}

		const signUp = async () => {
			return await register(email.value, password.value, firstName.value, middleName.value, lastName.value);
		}


		const validateTwo = () => {
			if (mobileNumber.value) {
				pageNum.value = 2
				countDown()
			} else {
				Notify.create('Please enter your mobile number.')
			}
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

		const validateThree = () => {
			if (verificationCode.value) {
				//link mobile number
				const provider = new PhoneAuthProvider(auth);
				const verificationId = provider.verifyPhoneNumber(mobileNumber.value, applicationVerifier);
				const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode.value);
				const auth = getAuth();
				linkWithCredential(auth.currentUser, authCredential)


			}
		}


		return {
			// Rules
			emailRules: [
				val => (val && val.length > 0 && val.includes('@') && val.includes('.')) || 'Please enter a valid email address'
			],
			passwordRules: [
				val => (val && val.length > 5) || 'Password must be 6 or more characters long'
			],
			firstNameRules: [
				val => (val && val.length > 0) || 'Please enter your first name'
			],
			lastNameRules: [
				val => (val && val.length > 0) || 'Please enter your last name'
			],
			numberRules: [
				val => (val && val.length === 13 && val.includes('+639')) || 'Please enter a valid phone number'
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
			countDown,
			validateThree,

			// Plain values
			isPwd,
			pageNum,
			countDownDone,
			timer,
		}
	}
})
</script>


 