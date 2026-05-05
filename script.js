// Logout function
function logoutUser() {
  window.location.href = "index.html";
}

// AI Music Recommendation
async function getMusic() {
  const mood = document.getElementById("mood").value.trim().toLowerCase();
  const output = document.getElementById("output");
  const body = document.body;

  if (!mood) {
    output.innerHTML = `<p class='text-red-400'>Please enter a mood 🎵</p>`;
    return;
  }

  output.innerHTML = `<p class='text-gray-300 animate-pulse'>Analyzing your vibe... 🎧</p>`;

  try {
    // Connect to backend
    const res = await fetch("http://127.0.0.1:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });

    const data = await res.json();

    if (data.status === "success") {
      const song = data.recommendation;

      // Change background color based on mood
      const colors = {
        happy: "from-yellow-400 via-orange-400 to-pink-500",
        sad: "from-slate-700 via-gray-800 to-slate-900",
        calm: "from-teal-400 via-cyan-500 to-blue-600",
        angry: "from-red-600 via-rose-700 to-purple-800",
      };
      const selected = colors[mood] || "from-[#0f172a] via-[#1e293b] to-[#334155]";
      body.className = `font-[Poppins] text-white min-h-screen flex items-center justify-center bg-gradient-to-br ${selected}`;

      // Display recommended song with embedded YouTube player
      output.innerHTML = `
        <div class='bg-white/10 p-4 rounded-2xl mt-4'>
          <p class='mb-2 text-yellow-300 font-semibold'>Your ${mood} mood recommendation 🎶</p>
          <p class='text-white mb-3'>${song.title}</p>
          <iframe class='rounded-xl' width="300" height="170"
            src="${song.url.replace("watch?v=", "embed/")}"
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      output.innerHTML = `<p class='text-red-400 mt-3'>${data.message}</p>`;
    }
  } catch (err) {
    output.innerHTML = `<p class='text-red-400 mt-3'>Error connecting to backend 😢</p>`;
  }
}
