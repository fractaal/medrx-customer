<template>
    <div class="flex flex-row flex-nowrap p-4 space-x-4 overflow-x-scroll overflow-y-hidden">
		<slot/>
	</div>
</template>

<script>
	export default {
		name: 'HorizontalScroller'
	}
</script>