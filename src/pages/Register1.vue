<template>
	<q-page>
		<div class="mt-20 text-4xl text-center font-black text-MedRx_theme">Sign Up</div>
		<div
			class="mt-10 px-10 text-sm font-semibold"
		>Let's get you started for your MedRx account first.</div>

		<div class="gap-4 px-10 grid-cols-2 grid">
			<div>
				<div class="mt-5 mb-1 text-sm font-semibold">First name</div>
				<div style="max-width: 200px">
					<q-input v-model='fname' dense outlined label="John" lazy-rules :rules='fnameRules'/>
				</div>
			</div>
			<div>
				<div class="mt-5 mb-1 text-sm font-semibold">Middle name (Optional)</div>
				<div style="max-width: 200px">
					<q-input v-model='mname' dense outlined label="Nathan" />
				</div>
			</div>
		</div>
		<div class="gap-4 px-10 grid-cols-2 grid">
			<div>
				<div class="mt-5 mb-1 text-sm font-semibold">Last name</div>
				<div style="max-width: 200px">
					<q-input v-model='lname' dense outlined label="Doe" lazy-rules :rules='lnameRules'/>
				</div>
			</div>
		</div>
		<div class="gap-4 px-10 grid-cols-1 grid">
			<div>
				<div class="mt-5 mb-1 text-sm font-semibold">E-mail address</div>
				<div>
					<q-input v-model='email' dense outlined label="youremail@email.com" lazy-rules :rules='emailRules'/>
				</div>
			</div>
		</div>
		<div class="gap-4 px-10 grid-cols-1 grid">
			<div>
				<div class="mt-5 mb-1 text-sm font-semibold">Password</div>
				<div>
					<q-input v-model='password' dense outlined label="Password123" :type="isPwd ? 'password' : 'text'" lazy-rules :rules='passwordRules'>
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
		<div class="gap-4 px-10 mt-3 grid-cols-2 grid">
			<div />
			<div align="right">
				<q-btn @click='Validate()' color="primary" label="Continue"/>
			</div>
		</div>
		
	</q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { register } from 'src/api/firebase';
import { Notify } from 'quasar'
import { useRouter } from 'vue-router';

export default defineComponent({
	setup() {

		const email = ref('');
		const password = ref('');
		const fname = ref('');
		const mname = ref('');
		const lname = ref('');
		const router = useRouter();
		const isPwd = ref(true);
		
// TODO improve validation, must be on sync with Rules below.
		const SignUp = async () => {
			await register(email.value, password.value, fname.value, mname.value, lname.value) ? router.push('/register2') : null;
		}

		const Validate = () => {
			if(email.value, password.value, fname.value, lname.value){
				SignUp()
			}else{
				Notify.create('Please fill up the necessary fields.')
			}
		}

		return {
			email,
			emailRules: [
				val => (val && val.length > 0 && val.includes('@') && val.includes('.')) || 'Please enter a valid email address'
			],
			password,
			passwordRules: [
				val => (val && val.length > 5) || 'Password must be 6 or more characters long'
			],
			fname,
			fnameRules: [
				val => (val && val.length > 0) || 'Please enter your first name'
			],
			mname,
			lname,
			lnameRules: [
				val => (val && val.length > 0) || 'Please enter your last name'
			],
			Validate,
			isPwd
		}
	}
})
</script>


 