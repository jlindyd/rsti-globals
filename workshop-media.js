/* Workshop popup media. Add photos, videos, or embeds for each workshop popup.
   - Put files in assets/workshops/ and list them below, in the order you want.
   - Entries with an empty src are ignored; if a popup has no entries it shows its drawing.
   - type "image":  { type: "image", src: "assets/workshops/helicopter-1.jpg", caption: "Teams test their prototypes" }
   - type "video":  { type: "video", src: "assets/workshops/helicopter.mp4", poster: "assets/workshops/helicopter-poster.jpg", caption: "..." }
   - type "embed":  { type: "embed", src: "https://www.youtube.com/embed/VIDEO_ID", caption: "..." }   (YouTube/Vimeo embed URL) */
window.RSTI_WORKSHOPS = {
  "workshop-oex": [
    { type: "image", src: "", caption: "" },
    { type: "video", src: "", poster: "", caption: "" }
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
