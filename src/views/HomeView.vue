<template>
  <div class="h-screen flex items-center justify-center">
    <div class="w-8/12 flex flex-col items-center">
      <!-- Step Indicator -->
      <ul class="flex items-center border-x divide-x mb-20">
        <li
          :class="{ 'bg-sky-500 text-white': step === 1 }"
          class="px-4 py-2 border-y"
        >
          Choose Book
        </li>
        <li
          :class="{ 'bg-sky-500 text-white': step === 2 }"
          class="px-4 py-2 border-y"
        >
          Edit Cover
        </li>
        <li
          :class="{ 'bg-sky-500 text-white': step === 3 }"
          class="px-4 py-2 border-y"
        >
          Preview & Download
        </li>
      </ul>

      <!-- Step 1: Choose Book -->
      <div class="w-4/12" v-if="step === 1">
        <select
          type="select"
          @change="changeBook"
          class="w-full border rounded-md p-3 outline-0 mb-20"
        >
          <option default value="">Select book to edit cover page</option>
          <option v-for="(book, index) in books" :value="index" :key="index">
            {{ book.title }}
          </option>
        </select>
        <div class="flex justify-center">
          <button
            type="button"
            :disabled="isDisabled"
            @click="step = 2"
            class="bg-sky-500 disabled:bg-gray-400 text-white px-6 py-2 rounded-md border-0 outline-none text-center"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Step 2: Edit Cover -->
      <div class="w-4/12" v-if="step === 2">
        <div class="flex justify-center" v-if="!previewImage">
          <!-- File Upload -->
          <div class="relative">
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="absolute w-full h-full opacity-0"
            />
            <div class="flex items-center gap-2 shadow px-4 py-2">
              <div class="shrink-0">
                <img
                  src="https://static.thenounproject.com/png/3579236-200.png"
                  width="30"
                />
              </div>
              <p class="text-black text-[16px]">Click to import cover image</p>
            </div>
          </div>
        </div>
        <div v-else>
          <!-- Preview Image -->
          <img
            :src="previewImage"
            alt="Preview Image"
            class="w-full max-h-[350px] object-contain"
          />
        </div>
        <div class="flex justify-center mt-20">
          <button
            type="button"
            @click="step = 3"
            :disabled="!previewImage"
            class="bg-sky-500 disabled:bg-gray-400 text-white px-6 py-2 rounded-md border-0 outline-none text-center"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Step 3: Preview & Download -->
      <div class="w-8/12" v-if="step === 3">
        <div class="flex divide-x min-h-[350px]">
          <div class="w-6/12 space-y-4">
            <!-- Customization Options -->
            <div class="flex items-center gap-3">
              <p class="text-[16px]">Font Size</p>
              <input
                v-model="styles[changeStyle].fontSize"
                type="number"
                class="w-16 h-10 border p-2"
              />
            </div>
            <div class="flex items-center gap-3">
              <p class="text-[16px]">Text Color</p>
              <input
                v-model="styles[changeStyle].color"
                type="color"
                class="w-16 h-10 border"
              />
            </div>
            <div class="flex items-center gap-3">
              <p class="text-[16px]">Letter Spacing</p>
              <input
                v-model="styles[changeStyle].spacing"
                type="number"
                class="w-16 h-10 border p-2"
              />
            </div>
          </div>
          <div class="w-6/12 text-center relative" ref="captureArea">
            <!-- Canvas Workspace -->
            <div class="workspace z-10 relative" ref="workspace">
              <FreeTransform
                v-for="element in elements"
                :key="element.id"
                :x="element.x"
                :y="element.y"
                :scale-x="element.scaleX"
                :scale-y="element.scaleY"
                :width="element.width"
                :height="element.height"
                :angle="element.angle"
                :offset-x="offsetX"
                :offset-y="offsetY"
                :selected="element.id === selectedElement"
                :selectOn="element.selectOn"
                @onSelect="setSelected(element.id)"
                @update="update(element.id, $event)"
                :styles="{ zIndex: element.id === selectedElement ? 2 : 1 }"
                :aspect-ratio="false"
                :scale-from-center="false"
              >
                <h3
                  @click="changeStyle = element.select"
                  :style="{
                    fontSize: `${
                      element.select === 'title'
                        ? styles.title.fontSize
                        : styles.author.fontSize
                    }px`,
                    color:
                      element.select === 'title'
                        ? styles.title.color
                        : styles.author.color,
                    letterSpacing: `${
                      element.select === 'title'
                        ? styles.title.spacing
                        : styles.author.spacing
                    }px`,
                  }"
                  class="cursor-pointer relative z-10"
                >
                  {{ element.text }}
                </h3>
              </FreeTransform>
            </div>
            <!-- Background Image -->
            <img
              :src="previewImage"
              alt="Preview Image"
              class="max-w-full max-h-[350px] object-contain absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-0"
            />
          </div>
        </div>
        <!-- Save Button -->
        <div class="flex justify-center mt-20">
          <button
            type="button"
            @click="capture"
            class="bg-sky-500 text-white px-6 py-2 rounded-md border-0 outline-none text-center"
          >
            Save Cover Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/services/api";
import FreeTransform from "../components/FreeTransform.vue";
import html2canvas from "html2canvas";

export default {
  components: { FreeTransform },
  data() {
    return {
      apiKey: import.meta.env.VITE_API_Key,
      books: [],
      thumbnail: "",
      previewImage: null,
      selectedBook: {},
      step: 1,
      styles: {
        title: {
          fontSize: 20,
          color: "#000000",
          spacing: 1,
        },
        author: {
          fontSize: 20,
          color: "#000000",
          spacing: 1,
        },
      },
      changeStyle: "title",
      elements: [
        {
          id: "el-4",
          x: 0,
          y: 10,
          scaleX: 1,
          scaleY: 1,
          width: 425,
          height: 30,
          angle: 0,
          selectOn: "mousedown",
          text: "",
          select: "title",
        },
        {
          id: "el-5",
          x: 0,
          y: 70,
          scaleX: 1,
          scaleY: 1,
          width: 425,
          height: 30,
          angle: 0,
          selectOn: "mousedown",
          text: "",
          select: "author",
        },
      ],
      offsetX: 0,
      offsetY: 0,
      selectedElement: null,
      capturedImage: null,
    };
  },
  computed: {
    isDisabled() {
      return Object.keys(this.selectedBook).length === 0;
    },
  },
  methods: {
    //To fetch books list from api
    async fetchBooks() {
      try {
        const result = await apiClient.get(
          `/svc/books/v3/lists/overview.json?api-key=${this.apiKey}`
        );
        const data = await result.data.results.lists[1].books;
        this.books = data.slice(0, 5);
        console.log(data, "data");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    //To upload the book cover image
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.previewImage = URL.createObjectURL(file);
      } else {
        this.previewImage = null;
      }
    },
    changeBook(event) {
      const selectedBook = this.books[event.target.value];
      this.selectedBook = selectedBook;
      this.elements[0].text = this.selectedBook.title;
      this.elements[1].text = this.selectedBook.author;
    },
    update(id, payload) {
      this.elements = this.elements.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...payload,
          };
        }
        return item;
      });
    },
    getElementStyles(element) {
      const styles = element.styles ? element.styles : {};
      return {
        width: `${element.width}px`,
        height: `${element.height}px`,
        ...styles,
      };
    },
    setSelected(id) {
      this.selectedElement = id;
    },
    async capture() {
      const captureArea = this.$refs.captureArea;
      html2canvas(captureArea).then((canvas) => {
        const data = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = data;
        link.download = `${this.selectedBook.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
  },

  mounted() {
    this.fetchBooks();
  },
};
</script>