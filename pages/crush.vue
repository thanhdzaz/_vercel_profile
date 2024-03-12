<template>
  <div class="flex min-h-screen w-full flex-col items-center justify-center gap-[20px] pt-[30px]">
    <div class="wrapper">
      <h2 class="question">You like me?</h2>
      <nuxt-img
        :src="isClick ? 'https://raw.githubusercontent.com/DzarelDeveloper/Img/main/gif.webp' : 'https://raw.githubusercontent.com/DzarelDeveloper/Img/main/gifyou.webp'"
        id="nuxt-image" class="w-[200px] object-cover sm:w-[170px]" />
      <div class="btn-group">
        <button @click="handleMouseClick" class="yes-btn">Yes</button>
        <button @mouseover="handleMouseOver" style="z-index: 999999999;" class="no-btn">No</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isClick = ref(false);

const handleMouseClick = () => {
  const question = document.querySelector(".question");
  if (question)
    question.innerHTML = "Aaaaa, I like you too";
  isClick.value = true;
};

const handleMouseOver = (e: any) => {

  const noBtnRect = e?.target?.getBoundingClientRect();
  const maxX = window.innerWidth - noBtnRect.width;
  const maxY = window.innerHeight - noBtnRect.height;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  if (e?.target) {

    e.target.style.position = "absolute";
    e.target.style.left = randomX + "px";
    e.target.style.top = randomY + "px";
  }

};
</script>
