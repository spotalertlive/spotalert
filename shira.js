// Placeholder for Shira assistant entry point.
// For now, this just opens an email draft to support with a prefilled subject.
window.addEventListener('DOMContentLoaded', () => {
  // If you later add a floating chat button, wire it here.
  // Example helper:
  window.askShira = (topic = 'General') => {
    const mailto = `mailto:support@spotalert.live?subject=Shira%20Assistant%20-%20${encodeURIComponent(topic)}`;
    window.location.href = mailto;
  };
});
