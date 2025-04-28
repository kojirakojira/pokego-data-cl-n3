<template>
  <div class="text-center">
    <img :src="editUtils().getUrl('brainjuice/brain-juice-q.png')" class="brain-icon" width="200" height="200">
    <p class="link" @click="$router.back()">
      戻る
    </p>
  </div>
</template>
