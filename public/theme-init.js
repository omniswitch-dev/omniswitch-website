// Runs before the page paints; a blocked storage API must not prevent rendering.
;(function () {
  let preference = 'light'
  try {
    const saved = localStorage.getItem('omniswitch-theme')
    if (saved === 'light' || saved === 'dark' || saved === 'system') preference = saved
  } catch {}
  const dark =
    preference === 'dark' ||
    (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document.documentElement.dataset.themePreference = preference
})()
