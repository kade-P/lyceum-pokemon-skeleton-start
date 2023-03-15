<script setup>
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const targetPokemon = ref("")
const displayDialog = ref(false)
const { data: pokemons, refresh } = await useFetch(
  () =>
    `https://pokeapi.co/api/v2/pokemon?offset=0&limit=50`
);

const catchTargetPokemon = async (pokemon) => {
    const trainer = route.params.name;
    const response = await fetch(`${config.backendOrigin}/api/trainer/${route.params.name}/pokemon/${pokemon}`,
    {method:"PUT",
});
    if (!response.ok) return;
    router.push(`/trainer/${router.params.name}`);
};

</script>

<template>
    {{ route.params.name }}
    <p>
      <GamifyList>
        <GamifyItem v-for="pokemon in pokemons.results">
          <span>{{ pokemon.name }}</span>
          <span>
            <GamifyButton @click="displayDialog=true ; targetPokemon=pokemon.name ">捕獲</GamifyButton>
          </span>
        </GamifyItem>
      </GamifyList>
    </p>

    <GamifyDialog
      v-if="displayDialog==true"
      title="確認"
      :description="`${targetPokemon}を捕獲するのですね？`"
    >
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="displayDialog=false; targetPokemon=''">いいえ</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="displayDialog=false; catchTargetPokemon(targetPokemon)">はい</GamifyButton>
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>

</template>