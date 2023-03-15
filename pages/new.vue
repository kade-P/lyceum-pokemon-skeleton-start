<script setup>
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref("");
const sentence = ref("")
const displayDialog = ref(false)

const addTrainer = async () => {
  const response = await fetch(`${config.backendOrigin}/api/trainer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: trainerName.value,
    }),
  });
  if (!response.ok) return;
  router.push(`/trainer/${trainerName.value}`);
};
</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <p>名前を入力しなさい</p>
    <form @submit.prevent>
      <div class="item">
        <label for="name">名前</label>
        <span></span>
        <input id="name" v-model="trainerName"/>
      </div>
      <GamifyButton @click="displayDialog=true">確定</GamifyButton>
    </form>
  </div>

  <!-- {{ displayDialog }}
  {{ trainerName.length }}
  {{ sentence }} -->

  <GamifyDialog
      v-if="displayDialog==true&&trainerName.length>0"
      title="確認"
      :description="`君は　${trainerName}　ですね？`"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="displayDialog=false">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="displayDialog=false; addTrainer()">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
