<template>
	<div v-if="token">
		<template v-if="isPolling">
			<p>Please login to your account through your web browser.</p>

			<app-progress-poller
				:url="`/web/auth/poll-oauth/${token}`"
				:interval="2500"
				@complete="completed"
				@error="failed"
			/>
		</template>
		<template v-else>
			<app-loading
				:label="$gettext('auth.linked_account.loading_message')"
				:centered="true"
				:big="true"
			/>
		</template>
	</div>
</template>

<script lang="ts" src="./poll"></script>
