<template>
	<span
		class="user-dogtag tag"
		:class="{
			'tag-highlight': type === 'gmr',
			'tag-highlight': type === 'dev',
			'tag-notice': ['gmr', 'dev', 'guy', 'ban'].indexOf(type) == -1,
			'user-dogtag-guy': type === 'guy',
		}"
	>
		{{ type }}
	</span>
</template>

<script lang="ts" src="./dogtag"></script>
