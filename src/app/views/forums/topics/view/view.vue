<template>
	<div v-if="topic">
		<app-page-header>
			<div>
				<span
					class="tag"
					v-if="topic.is_locked"
					v-app-tooltip="$gettext(`This topic is locked and can no longer be replied to.`)"
				>
					<app-jolticon icon="lock" />
					<translate>Locked</translate>
				</span>
			</div>

			<h1 :class="{ h2: Screen.isMobile }">
				{{ topic.title }}
			</h1>

			<div>
				<translate>by</translate>
				<router-link :to="{ name: 'profile.overview', params: { username: topic.user.username } }">
					{{ topic.user.display_name }}
					<app-user-verified-tick :user="topic.user" />
					<small>@{{ topic.user.username }}</small>
				</router-link>

				<span class="small" v-if="!Screen.isXs">
					<span class="dot-separator"></span>
					<app-time-ago :date="topic.posted_on" />
				</span>
			</div>

			<app-user-card-hover slot="spotlight" :user="topic.user">
				<app-user-avatar :user="topic.user" />
			</app-user-card-hover>

			<template slot="nav">
				<app-forum-breadcrumbs :channel="channel" :sort="sort" page="view-topic" />
			</template>

			<app-page-header-controls slot="controls" v-if="app.user">
				<app-button
					v-if="!isFollowing"
					primary
					block
					@click="follow"
					v-app-tooltip="$gettext(`Keep track of replies in this topic.`)"
				>
					<translate>Follow</translate>
				</app-button>
				<app-button
					v-else
					primary
					solid
					block
					@click="unfollow"
					@mouseenter="unfollowHover = true"
					@mouseleave="unfollowHover = false"
					v-app-tooltip="$gettext(`Stop Following`)"
				>
					<translate>Following</translate>
				</app-button>

				<app-popper v-if="app.user" popover-class="fill-darkest" slot="end">
					<app-button circle trans icon="ellipsis-v" />

					<div slot="popover" class="list-group list-group-dark thin">
						<a class="list-group-item has-icon" @click="report">
							<app-jolticon icon="flag" notice />
							<translate>Report Topic</translate>
						</a>
						<a
							class="list-group-item"
							v-if="app.user.permission_level > 0"
							:href="Environment.baseUrl + `/moderate/forums/topics/toggle-sticky/${topic.id}`"
							target="_blank"
						>
							<translate>Toggle Sticky</translate>
						</a>
						<a
							class="list-group-item"
							v-if="app.user.permission_level > 0"
							:href="Environment.baseUrl + `/moderate/forums/topics/toggle-lock/${topic.id}`"
							target="_blank"
						>
							<translate>Toggle Lock</translate>
						</a>
						<a
							class="list-group-item"
							v-if="app.user.permission_level > 0"
							:href="Environment.baseUrl + `/moderate/forums/topics/edit/${topic.id}`"
							target="_blank"
						>
							<translate>Edit Topic</translate>
						</a>
						<a
							class="list-group-item"
							v-if="app.user.permission_level > 0"
							:href="Environment.baseUrl + `/moderate/forums/topics/move/${topic.id}`"
							target="_blank"
						>
							<translate>Move Topic</translate>
						</a>
						<a
							class="list-group-item"
							v-if="app.user.permission_level > 0"
							:href="Environment.baseUrl + `/moderate/forums/topics/remove/${topic.id}`"
							target="_blank"
						>
							<translate>Remove Topic</translate>
						</a>
						<a
							class="list-group-item"
							v-if="app.user.permission_level > 0"
							:href="Environment.baseUrl + `/moderate/users/view/${topic.user_id}`"
							target="_blank"
						>
							<translate>Moderate User</translate>
						</a>
					</div>
				</app-popper>
			</app-page-header-controls>
		</app-page-header>

		<section class="section">
			<div class="container">
				<div class="row">
					<div class="col-sm-3 col-sm-push-9 col-md-offset-1 col-md-push-8">
						<app-scroll-affix :disabled="!Screen.isDesktop" v-if="app.user">
							<app-button v-if="!topic.is_locked" primary block v-app-scroll-to="`add-reply`">
								<translate>Add Reply</translate>
							</app-button>

							<app-button
								v-if="topic.user_id === app.user.id && !topic.is_locked"
								block
								@click="editTopic"
								:disabled="isEditingTopic"
							>
								<translate>Edit</translate>
							</app-button>
						</app-scroll-affix>

						<br />
					</div>

					<div class="col-sm-9 col-sm-pull-3 col-md-8 col-md-pull-4">
						<!--
							Hide the main post while it's being edited.
						-->
						<template v-if="!isEditingTopic">
							<div :class="shouldShowVoting ? 'row' : ''">
								<div :class="shouldShowVoting ? 'col-sm-9' : ''">
									<!--
										We do a fade collapse for the main post after the first page.
									-->
									<div v-if="currentPage > 1">
										<app-fade-collapse
											:collapse-height="200"
											:is-open="showFullDescription"
											@require-change="canToggleDescription = $event"
											@expand="showFullDescription = true"
										>
											<app-content-viewer :source="topic.main_post.text_content" />
										</app-fade-collapse>

										<a
											class="hidden-text-expander"
											v-if="canToggleDescription"
											v-app-track-event="`forum-topic:show-full-post`"
											@click="showFullDescription = !showFullDescription"
										></a>
									</div>

									<!--
										No fade collapse on first page.
									-->
									<app-content-viewer
										v-if="currentPage <= 1"
										:source="topic.main_post.text_content"
									/>
								</div>
								<div
									v-if="shouldShowVoting"
									class="col-sm-3"
									:class="{
										'text-center': Screen.isXs,
										'text-right': !Screen.isXs,
									}"
								>
									<app-forum-topic-upvote-widget :topic="topic" />
								</div>
							</div>
						</template>
						<template v-else>
							<h3 class="section-header">
								<translate>Edit Topic</translate>
							</h3>
							<form-forum-topic
								:model="topic"
								:channel="channel"
								@cancel="closeEditTopic"
								@submit="closeEditTopic"
							/>
						</template>

						<hr />

						<p class="text-muted small" v-if="topic.replies_count > perPage">
							Page {{ currentPage | number }} of {{ topic.replies_count | number }} replies.
						</p>

						<app-message-thread-pagination
							:items-per-page="perPage"
							:total-items="topic.replies_count"
							:current-page="currentPage"
						/>

						<app-forum-post-list
							id="forum-posts-list"
							:topic="topic"
							:posts="posts"
							:sort="sort"
							:user-post-counts="userPostCounts"
							@replied="onPostAdded"
						/>

						<app-message-thread-pagination
							:items-per-page="perPage"
							:total-items="topic.replies_count"
							:current-page="currentPage"
							@pagechange="pageChange"
						/>

						<hr />

						<template v-if="app.user">
							<app-message-thread-add v-if="!topic.is_locked">
								<h4 class="sans-margin-top" id="add-reply">
									<translate>Add Reply</translate>
								</h4>

								<form-forum-post :topic="topic" @submit="onPostAdded" />
							</app-message-thread-add>

							<div class="alert full-bleed-xs" v-if="topic.is_locked">
								<p>
									<app-jolticon icon="lock" />
									<translate>This topic is locked and can no longer be replied to.</translate>
								</p>
							</div>
						</template>
						<div v-else class="alert full-bleed-xs">
							<p>
								<app-jolticon icon="exclamation-circle" />
								<a :href="loginUrl">
									<translate>You must be logged in to Game Jolt to post replies.</translate>
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts" src="./view"></script>
