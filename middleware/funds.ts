export default function () {
  const password = localStorage.getItem('password');
  const configPassword = useRuntimeConfig().public.adminPassword;
  // Check if user is entered password
  if (!password || password != configPassword) {
    return navigateTo('/funds-enter-password');
  }
}
