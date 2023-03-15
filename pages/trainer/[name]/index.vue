<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const displayDialog = ref(false)
const { data: trainer } = await useFetch(
  () => `${config.backendOrigin}/api/trainer/${route.params.name}`
);

const catchPokemon = () => {
  router.push(`/trainer/${route.params.name}/catch`)
}

const namePokemon = (pokemon) => {

}

const deleteTrainer = async () => {
  const response = await fetch(`${config.backendOrigin}/api/deleteTrainer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: route.params.name,
    }),
  });
  if (!response.ok) return;
  router.push("/");
};
</script>

<template>
  <div>
    <p>
      トレーナー名：{{ $route.params.name }}　
    </p>
    <p>
      <GamifyButton @click="displayDialog = true">帰郷</GamifyButton>
    </p>
    <p>
      在庫
    </p>
    <p>
      <GamifyButton @click="catchPokemon">捕獲</GamifyButton>
    </p>
    <p>
      <GamifyList>
        <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
          <span>{{ pokemon.name }} | {{ pokemon.name }}</span>
          <span>
            <GamifyButton @click="namePokemon(pokemon)">命名</GamifyButton>
            <GamifyButton @click="sellPokemon(pokemon)">出荷</GamifyButton>
          </span>
        </GamifyItem>
      </GamifyList>
    </p>

  </div>

  <GamifyDialog v-if="displayDialog == true" title="確認" :description="`帰郷するのですね？この操作は取り消せません`">
    <GamifyList :border="false" direction="horizon">
      <GamifyItem>
        <GamifyButton @click="displayDialog = false">いいえ</GamifyButton>
      </GamifyItem>
      <GamifyItem>
        <GamifyButton @click="displayDialog = false; deleteTrainer()">はい</GamifyButton>
      </GamifyItem>
    </GamifyList>
  </GamifyDialog>
</template>