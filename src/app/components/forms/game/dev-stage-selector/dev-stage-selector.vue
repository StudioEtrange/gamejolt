<template>
	<div class="dev-stage-selector">
		<div v-for="stage of stages">
			<a @click="select(stage)">
				<app-card :is-disabled="!isEnabled(stage)">
					<div class="dev-stage-selector-content">
						<div class="card-title">
							<h4>
								<app-jolticon
									:icon="
										game && game.development_status === stage
											? 'radio-circle-filled'
											: 'radio-circle'
									"
								/>
								<template v-if="stage === Game.DEVELOPMENT_STATUS_DEVLOG">
									<translate>Devlog-Only</translate>
								</template>
								<template v-else-if="stage === Game.DEVELOPMENT_STATUS_WIP">
									<translate>Early Access</translate>
								</template>
								<template v-else-if="stage === Game.DEVELOPMENT_STATUS_FINISHED">
									<translate>Complete/Stable</translate>
								</template>
							</h4>
						</div>

						<div class="card-content">
							<template v-if="stage === Game.DEVELOPMENT_STATUS_DEVLOG">
								<template>
									<translate>
										You don't have anything playable yet, but would like to share active game
										development in the form of images, videos, posts and more.
									</translate>
								</template>
							</template>
							<template v-else-if="stage === Game.DEVELOPMENT_STATUS_WIP">
								<template>
									<translate>
										Your game has playable builds, but you're still actively developing it.
									</translate>
								</template>
							</template>
							<template v-else-if="stage === Game.DEVELOPMENT_STATUS_FINISHED">
								<template>
									<translate>
										Your game is complete. It's in a stable state and you only plan on making bug
										fixes, performance optimizations, or small improvements.
									</translate>
								</template>
							</template>
						</div>

						<template v-if="!isEnabled(stage)">
							<br />
							<div class="alert sans-margin">
								<app-jolticon icon="notice" />
								<translate>
									You must have active published packages to transition to this stage.
								</translate>
							</div>
						</template>
					</div>

					<div class="dev-stage-selector-mascot">
						<img
							v-if="stage === Game.DEVELOPMENT_STATUS_DEVLOG"
							src="./mascot-devlog.png"
							width="68"
							height="68"
							alt=""
						/>
						<img
							v-else-if="stage === Game.DEVELOPMENT_STATUS_WIP"
							src="./mascot-early-access.png"
							width="48"
							height="46"
							alt=""
						/>
						<img
							v-else-if="stage === Game.DEVELOPMENT_STATUS_FINISHED"
							src="./mascot-complete.png"
							width="52"
							height="54"
							alt=""
						/>
					</div>
				</app-card>
			</a>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
.dev-stage-selector

	.card
		position: relative

	&-content
		margin-right: 100px

	&-mascot
		position: absolute
		right: 0
		top: 0
		bottom: 0
		width: 100px
		display: flex
		align-items: center
		justify-content: center
</style>

<script lang="ts" src="./dev-stage-selector"></script>
