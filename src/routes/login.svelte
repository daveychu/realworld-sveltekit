<script lang="ts">
	import { goto } from '$app/navigation';
	import { token } from '$lib/stores';
	import { post } from '$lib/utils';

	let email: string;
	let password: string;

	async function submit() {
		const response = await post(`api/users/login`, { user: { email, password } });

		if (response.user) {
			token.set(response.user.token);
			goto('/');
		}
	}
</script>

<div class="auth-page">
	<div class="container page">
		<div class="row">
			<div class="col-md-6 offset-md-3 col-xs-12">
				<h1 class="text-xs-center">Sign in</h1>
				<p class="text-xs-center">
					<a href="/register">Need an account?</a>
				</p>

				<!-- <ul class="error-messages">
					<li>That email is already taken</li>
				</ul> -->

				<form on:submit|preventDefault={submit}>
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
					<button class="btn btn-lg btn-primary pull-xs-right"> Sign in </button>
				</form>
			</div>
		</div>
	</div>
</div>
