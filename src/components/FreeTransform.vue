<template>
  <div @mousedown="mousedown">
    <div :style="computedStyles.element"><slot></slot></div>
  </div>
</template>

<script>
import { styler, translate } from "free-transform";

export default {
  name: "FreeTransform",
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    scaleX: {
      type: Number,
      required: true,
    },
    scaleY: {
      type: Number,
      required: true,
    },
    angle: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
    },
    selectOn: {
      validator: function (value) {
        return ["dblclick", "mousedown", "click"].indexOf(value) !== -1;
      },
      default: "mousedown",
    },
  },
  computed: {
    computedStyles() {
      const { element, controls } = styler({
        x: this.x,
        y: this.y,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        width: this.width,
        height: this.height,
        angle: this.angle,
      });

      return {
        element: {
          ...element,
          width: element.width ? `${element.width}px` : null,
          height: element.height ? `${element.height}px` : null,
        },
        controls: {
          ...controls,
          width: `${controls.width}px`,
          height: `${controls.height}px`,
        },
      };
    },
  },
  methods: {
    handleTranslation(event) {
      event.stopPropagation();
      const drag = translate(
        {
          x: this.x,
          y: this.y,
          startX: event.pageX,
          startY: event.pageY,
        },
        (payload) => {
          this.$emit("update", payload);
        }
      );

      this.onDrag(drag);
    },

    onDrag(drag) {
      const up = () => {
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", up);
    },

    mousedown(event) {
      this.$emit("mousedown", event);
      if (this.selectOn === "mousedown") {
        this.$emit("onSelect");
        this.handleTranslation(event);
      }
    },
  },
};
</script>
