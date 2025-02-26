<template>
  <div class="betaBanner-banner z-90" :style="cssProps">
    <div class="betaBanner-content text-xs font-semibold" :style="cssProps">
      <span class="dark:text-gray-800">{{ Banner.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    Banner: Object,
  },
  computed: {
    cssProps() {
      return {
        '--color': this.Banner.color,
      };
    },
  },
};
</script>

<style scoped>
.betaBanner-banner {
  position: fixed;
  left: 0;
  right: 0;
  border-top: 4px solid var(--color);
  text-align: center;
  line-height: 0;
  overflow: hidden;
  z-index: 98;
}

.betaBanner-content {
  font-family: 'Avenir Next', 'Helvetica Neue', Arial;
  line-height: 1.71;
  color: #fff !important;
  height: 0.8rem;
  position: relative;
  display: inline-block;
  padding: 0 0.8rem 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--color);
  line-height: 1;
}
.betaBanner-content::before,
.betaBanner-content::after {
  content: '';
  position: absolute;
  width: 4px;
  top: 0;
  height: 21px;
  z-index: -1;
  background: var(--color);
  transform: perspective(2px) rotateX(-30deg);
}
.betaBanner-content::before {
  left: -2px;
}
.betaBanner-content::after {
  right: -2px;
}
</style>
