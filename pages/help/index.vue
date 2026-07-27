<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="2" class="pa-4">
          <v-card-title class="text-h4 font-weight-bold mb-6 text-center">
            ヘルプ・よくある質問（FAQ）
          </v-card-title>

          <v-expansion-panels variant="accordion" multiple>
            <!-- カテゴリ：データについて -->
            <v-expansion-panel>
              <v-expansion-panel-title class="text-h6 font-weight-bold">
                Q. サイトのデータは最新ですか？
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1 bg-grey-lighten-4 pa-4">
                定期的に最新のデータに更新しておりますが、ゲーム内のアップデート（技の威力変更など）から反映まで数日程度お時間をいただく場合がございます。あらかじめご了承ください。
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="text-h6 font-weight-bold">
                Q. 新しいポケモンはいつ追加されますか？
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1 bg-grey-lighten-4 pa-4">
                公式ゲーム内で新しく実装され、詳細なデータが判明次第、順次データベースに追加いたします。
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- カテゴリ：独自の仕様・用語について -->
            <v-expansion-panel>
              <v-expansion-panel-title class="text-h6 font-weight-bold">
                Q. 「強ポケ補正」とは何ですか？
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1 bg-grey-lighten-4 pa-4">
                当サイト独自の名称です。<br>
                ポケモンGOの種族値は、原作の種族値から一定の変換式で算出されています。種族値が高すぎる一部のポケモンは算出された種族値から×0.91(メガシンカ、ゲンシカイキの場合は×0.97)されます。
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- カテゴリ：トラブルシューティング・その他 -->
            <v-expansion-panel>
              <v-expansion-panel-title class="text-h6 font-weight-bold">
                Q. グラフや画面が正しく表示されません。
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1 bg-grey-lighten-4 pa-4">
                お使いのブラウザのキャッシュが影響している可能性があります。一度ページを再読み込み（リロード）するか、ブラウザのキャッシュをクリアしてみてください。<br>
                それでも解決しない場合は、「お問い合わせ」よりご利用の端末（iPhone/PC等）を添えてご連絡いただけますと幸いです。
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="text-h6 font-weight-bold">
                Q. サイト内のイラストを使用してもいいですか？
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1 bg-grey-lighten-4 pa-4">
                管理人が手描きしたイラストにつきましては、個人的な範囲であれば自由にご利用いただけます。<br>
                利用条件等の詳細につきましては、「<NuxtLink to="/help/privacyPolicy" class="text-decoration-none text-primary">
                  プライバシーポリシー
                </NuxtLink>」の項目をご確認ください。
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="text-h6 font-weight-bold">
                Q. サイトへのリンクを貼ってもいいですか？
              </v-expansion-panel-title>
              <v-expansion-panel-text class="text-body-1 bg-grey-lighten-4 pa-4">
                当サイトはリンクフリーです。事前事後の連絡も不要ですので、SNSやブログ等でご自由に紹介・批判していただいて構いません。
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-divider class="my-6" />

          <div class="text-center">
            <p class="mb-4">
              上記で解決しない場合は、お問い合わせフォームよりご連絡ください。
            </p>
            <v-btn color="primary" variant="outlined" to="/help/inquiry" prepend-icon="mdi-email">
              お問い合わせフォームへ
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
useHead({
  title: 'ヘルプ・よくある質問'
})
</script>
