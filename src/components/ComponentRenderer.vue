<template>
  <g @mousedown="$emit('select')">
    <rect
      :x="box.x"
      :y="box.y"
      :width="box.width"
      :height="box.height"
      rx="10"
      ry="10"
      :fill="message[box.selectedKey] === 1 ? 'green' : 'gray'"
      :stroke="selected ? 'yellow' : 'black'"
      :stroke-width="selected ? 4 : 2"
      @mousedown.stop="$emit('mousedown', $event, { mode: 'move' })"
    />
    <rect
      :x="box.x + box.width - 10"
      :y="box.y + box.height - 10"
      width="10"
      height="10"
      fill="blue"
      cursor="se-resize"
      @mousedown.stop="$emit('mousedown', $event, { mode: 'resize' })"
    />
    <text
      :x="box.x + box.width / 2"
      :y="box.y + box.height / 2"
      text-anchor="middle"
      alignment-baseline="middle"
      :font-size="box.height * 0.4"
      font-weight="bold"
      fill="white"
    >
      {{ box.selectedKey }}: {{ message[box.selectedKey] }}
    </text>
  </g>
</template>

<script>
export default {
  name: 'ComponentRenderer',
  props: {
    box: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  }
}
</script>
