<template>
	<div class="media-bar-item" :style="{ width, height }">
		<a class="-wrapper" :style="{ height }">
			<slot />
			<app-media-item-backdrop class="-backdrop" :media-item="item.media_item" radius="lg">
				<app-img-responsive
					v-if="item.media_type !== 'sketchfab'"
					:src="item.img_thumbnail"
					:title="item.media_type == 'image' ? item.caption : item.title"
					alt=""
				/>

				<img v-else class="img-responsive" :src="item.img_thumbnail" alt="" />
			</app-media-item-backdrop>

			<span class="-play" v-if="item.media_type === 'video'">
				<app-jolticon icon="play" />
			</span>

			<span class="-play" v-if="item.media_type === 'sketchfab'">
				<app-jolticon icon="sketchfab" />
			</span>
		</a>
	</div>
</template>

<style lang="stylus" src="./item.styl" scoped></style>

<script lang="ts" src="./item"></script>
