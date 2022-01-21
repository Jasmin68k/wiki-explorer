import { reactive, readonly } from 'vue'

const state = reactive({
  count: 0
})

const incrementCount = () => {
  state.count++
}

export default { state: readonly(state), incrementCount }
