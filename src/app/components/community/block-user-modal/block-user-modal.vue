<script lang="ts" src="./block-user-modal"></script>

<template>
	<app-modal>
		<div class="modal-controls">
			<app-button @click="modal.dismiss()">
				<translate>Close</translate>
			</app-button>
		</div>
		<div class="modal-header">
			<h2 class="modal-title">
				<translate>Block User</translate>
			</h2>
		</div>
		<div class="modal-body">
			<form-community-block :community="community" :user="user" @submit="onFormSubmit" />
		</div>
	</app-modal>
</template>

<style lang="stylus" scoped></style>
