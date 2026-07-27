<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="text-h5 font-weight-bold pt-4 px-4">
            お問い合わせ
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <p class="mb-4">
              当サイトに関するご意見、ご要望、不具合の報告などは、以下のGoogleフォームよりお願いいたします。
            </p>
            <p class="mb-6 text-body-2 text-medium-emphasis">
              ※ご返信にはお時間をいただく場合がございます。あらかじめご了承ください。
            </p>
            <div class="text-center">
              <v-btn
                color="primary"
                size="large"
                href="https://docs.google.com/forms/d/e/1FAIpQLScyP-hRd_tgiPSH8wGU_P-Yrn177mrRuzUOHX9y-lPPUFsT7w/viewform?usp=publish-editor"
                target="_blank"
                rel="noopener noreferrer"
                prepend-icon="mdi-open-in-new"
              >
                Googleフォームを開く
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
useHead({
  title: 'お問い合わせ'
})
</script>
