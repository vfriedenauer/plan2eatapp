const startButton = document.getElementById('startButton') as HTMLButtonElement;

startButton?.addEventListener('click', () => {
  window.location.href = 'speiseplan.html'; // Weiterleitung zu speiseplan.html
});

// HTML-Inhalt in den #app-Div einfügen
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <header style="background-color: #EFF1F2; padding: 1rem;">
    <img src="/src/logo.png" alt="Logo" style="height: 40px;" />
  </header>
  <main style="text-align: center; padding-top: 2rem;">
    <h1 style="color: #1028BD;">Hallo</h1>
    <button id="startButton"
      style="
        background-color: #90AC8F;
        border: none;
        padding: 1rem 2rem;
        font-size: 1rem;
        cursor: pointer;
        border-radius: 8px;
      "
    >
      Loslegen
    </button>
  </main>
`;