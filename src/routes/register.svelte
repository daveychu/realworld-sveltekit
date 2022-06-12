<script lang="ts">
	import { goto } from '$app/navigation';
	import { post } from '$lib/utils';
	import { user } from '$lib/stores';

	let username = '';
	let email = '';
	let password = '';

	async function submit(event) {
		const response = await post(`api/users`, { user: { username, email, password } });

		if (response.user) {
			user.set(response.user);
			goto('/');
		}
	}
</script>

<div class="auth-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Sign up</h1>
				<p class="text-xs-center">
					<a href="/login">Have an account?</a>
				</p>

				<ul class="error-messages">
					<!-- <li>That email is already taken</li> -->
				</ul>

				<form on:submit|preventDefault={submit}>
					<fieldset class="form-group">
						<input
							class="form-control form-control-lg"
							type="text"
							placeholder="Your Name"
							bind:value={username}
						/>
					</fieldset>
					<fieldset class="form-group">
						<input
							class="form-control form-control-lg"
							type="text"
							placeholder="Email"
							bind:value={email}
						/>
					</fieldset>
					<fieldset class="form-group">
						<input
							class="form-control form-control-lg"
							type="password"
							placeholder="Password"
							bind:value={password}
						/>
					</fieldset>
					<button class="btn btn-lg btn-primary pull-xs-right"> Sign up </button>
				</form>
			</div>
		</div>
	</div>
</div>
