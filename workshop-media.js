/* Workshop popup media. Add photos, videos, or embeds for each workshop popup.
   - Put files in assets/workshops/ and list them below, in the order you want.
   - Entries with an empty src are ignored; if a popup has no entries it shows its drawing.
   - type "image":  { type: "image", src: "assets/workshops/helicopter-1.jpg", caption: "Teams test their prototypes" }
   - type "video":  { type: "video", src: "assets/workshops/helicopter.mp4", poster: "assets/workshops/helicopter-poster.jpg", caption: "..." }
   - type "embed":  { type: "embed", src: "https://www.youtube.com/embed/VIDEO_ID", caption: "..." }   (YouTube/Vimeo embed URL) */
window.RSTI_WORKSHOPS = {
  "workshop-oex": [
    { type: "image", src: "assets/workshops/helicopter-workshop-prototyping.jpg", caption: "Teams cut and tape their helicopter prototypes" },
    { type: "image", src: "assets/workshops/helicopter-workshop-testing.jpg", caption: "Dropping a prototype to test how it spins" },
    { type: "image", src: "assets/workshops/helicopter-workshop-exercise-instructions.jpg", caption: "The five-step exercise: Empathize, Define, Ideate, Prototype, Test" },
    { type: "image", src: "assets/workshops/helicopter-workshop-dfss-healthcare-talk.jpg", caption: "A session on Design for Six Sigma in healthcare" },
    { type: "image", src: "assets/workshops/helicopter-workshop-team-handshake.jpg", caption: "Participants at the University of Houston" },
    { type: "image", src: "assets/workshops/helicopter-workshop-instructors.jpg", caption: "Workshop facilitators" },
    { type: "image", src: "assets/workshops/helicopter-workshop-opening-remarks.jpg", caption: "Opening remarks" },
    { type: "image", src: "assets/workshops/helicopter-workshop-leadership-talk.jpg", caption: "A talk on setting direction and building a trust-based culture" },
    { type: "image", src: "assets/workshops/helicopter-workshop-group-photo.jpg", caption: "The workshop group, University of Houston Industrial Engineering" }
  ],
  "workshop-lss": [
    { type: "image", src: "", caption: "" },
    { type: "video", src: "", poster: "", caption: "" }
  ],
  "workshop-dfss": [
    { type: "image", src: "", caption: "" },
    { type: "video", src: "", poster: "", caption: "" }
  ]
};
