export const useBranding = () => {
  const colorMode = useColorMode();

  const logoSrc = computed(() => {
    return colorMode.value === 'dark' ? '/imgs/logo-darkmode.png' : '/imgs/logo.png';
  });

  const appName = 'Feedstream';

  return {
    logoSrc,
    appName,
  };
};
