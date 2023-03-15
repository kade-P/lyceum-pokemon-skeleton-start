<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const displayDialog = ref(false)
const displayNickname = ref(false)
const targetPokemonID = ref("")
const namedNickname = ref("")

const { data: trainer, refresh } = await useFetch(
  () => `${config.backendOrigin}/api/trainer/${route.params.name}`
);

const catchPokemon = () => {
  router.push(`/trainer/${route.params.name}/catch`)
}

const namePokemon = async () => {
  const trainerTmp = trainer.value;
  const idx = trainerTmp.pokemons.findIndex(({ id }) => id == targetPokemonID.value);
  trainerTmp.pokemons[idx].nickname = namedNickname.value;
  namedNickname.value = "";
  const response = await fetch(
    `${config.backendOrigin}/api/trainer/${route.params.name}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trainerTmp),
    }
  );
  if (!response.ok) return;
  await refresh();
};

const sellPokemon = async (pokemon) => {
  const response = await fetch(`${config.backendOrigin}/api/trainer/${route.params.name}/pokemon/${pokemon.id}`, {
    method: "DELETE",
  });
  console.log(response.ok)
  if (!response.ok) return;
  await refresh();
};

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
          <span>{{ pokemon.name }} | {{ pokemon.nickname }}</span>
          <span>
            <GamifyButton @click="displayNickname = true ; targetPokemonID=pokemon.id">命名</GamifyButton>
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

<GamifyDialog v-if="displayNickname == true" title="命名" :description="`名前を付けてください`">
  <GamifyList :border="false" direction="horizon">
    <GamifyItem>

      <form @submit.prevent>
      <div class="item">
        <input id="name" v-model="namedNickname"/>
      </div>
      <GamifyButton @click="displayNickname=false; namePokemon()">確定</GamifyButton>
    </form>

    </GamifyItem>
  </GamifyList>
</GamifyDialog>
</template>