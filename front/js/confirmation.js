;(() => {
    const orderId = new URL(location.href).searchParams.get('orderId') || 'ERREUR'
    document.getElementById('orderId').textContent = orderId
  })()