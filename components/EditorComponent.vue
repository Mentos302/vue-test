<template>
  <div class="m-16 rounded text-gray-500 text-sm">
    <div class="mb-2 flex items-center justify-between">
      <span class="text-bsse">Target definition</span>
      <div class="flex gap-4">
        <button
          @click="insertTarget"
          class="px-3.5 text-sm border rounded-md border-gray-100 text-zinc-500"
          v-if="!target"
        >
          Insert target
        </button>
        <button
          @click="insertDeadline"
          class="px-3.5 text-sm border rounded-md border-gray-100 text-zinc-500"
          v-if="!deadline"
        >
          Insert deadline
        </button>
      </div>
      <button
        @click="insertBaseline"
        class="px-3.5 text-sm border rounded-md border-gray-100 text-zinc-500"
        v-if="target && deadline"
      >
        Insert baseline
      </button>
    </div>
    <div class="p-4 py-1.5 bg-slate-50 rounded text-black">
      <div class="h-[50px] flex items-center gap-2" @click="focusInput">
        <div class="relative">
          <input
            type="text"
            placeholder="Start writing target description...."
            class="w-[250px] bg-transparent text-neutral-700 focus:outline-none"
            v-model="inputValue"
            @input="handleTargetValueChange"
            ref="inputRef"
          />
          <div
            class="w-[170px] p-1 absolute flex flex-col bg-white border border-gray-300 rounded-md shadow-md text-left items-start"
            ref="dropdownRef"
            v-if="showDropdown"
          >
            <button
              @click="
                insertTarget();
                hideDropdown();
              "
              class="w-full p-1 hover:bg-slate-100 text-left"
            >
              Insert target
            </button>
            <button
              @click="
                insertDeadline();
                hideDropdown();
              "
              class="w-full p-1 hover:bg-slate-100 text-left"
            >
              Insert deadline
            </button>
          </div>
        </div>
        <div
          class="flex gap-1 p-1 rounded bg-white text-zinc-500 border"
          v-if="target"
        >
          <div
            class="w-[48px] focus:outline-none bg-slate-50 placeholder:text-neutral-700 text-center text-neutral-700"
          >
            {{ target.value }}
          </div>
          <span>{{ target.unit }}</span>
        </div>
        <div class="flex gap-1 items-center" v-if="deadline">
          <span>by</span>
          <div
            class="flex items-center px-2 py-0 rounded border bg-white gap-2 border text-neutral-700"
          >
            <template v-if="deadline.type === 'year'">
              <input
                type="number"
                min="1900"
                max="2099"
                step="1"
                v-model="deadline.value"
              />
            </template>
            <template v-else-if="deadline.type === 'month'">
              <input type="month" v-model="deadline.value" />
            </template>
            <template v-else-if="deadline.type === 'day'">
              <input type="date" name="" id="" v-model="deadline.value" />
            </template>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 self-end justify-end" v-if="baseline">
        <span>Baseline is</span>
        <template v-if="baseline.type === 'year'">
          <input
            type="number"
            min="1900"
            max="2099"
            step="1"
            v-model="baseline.value"
            class="text-center border rounded"
          />
        </template>
        <template v-else-if="baseline.type === 'month'">
          <input type="month" v-model="baseline.value" />
        </template>
        <template v-else-if="baseline.type === 'day'">
          <input type="date" name="" id="" v-model="baseline.value" />
        </template>
      </div>
    </div>
    <div>
      <div class="bg-red">
        <div v-for="sTarget in savedTargets" :key="sTarget.text">
          <div class="relative">
            <h1>{{ sTarget.text }}</h1>
            <div
              class="bg-transparent text-neutral-700 focus:outline-none w-[250px]"
            >
              {{ sTarget.text }}
            </div>
          </div>
          <div class="flex gap-1 p-1 rounded bg-white text-zinc-500 border">
            <div
              class="w-[48px] focus:outline-none bg-slate-50 placeholder:text-neutral-700 text-center text-neutral-700"
            >
              {{ sTarget.target.value }}
            </div>
            <span>{{ sTarget.target.unit }}</span>
          </div>
          <div class="flex gap-1 items-center">
            <span>by</span>
            <div
              class="flex items-center px-2 py-0 rounded border bg-white gap-2 borde text-neutral-700"
            >
              {{ sTarget.deadline.value }}
            </div>
          </div>
        </div>
        <button class="p-2 text-neutral-700" @click="addNewTarget(inputValue)">
          + Add new target in another year
        </button>
      </div>
    </div>
    <div :class="['mt-4', baseline ? 'grid-cols-3' : 'grid-cols-2']">
      <div v-if="target">
        <span class="block mb-1">Target unit</span>
        <div class="flex gap-2 items-center">
          <input
            type="radio"
            name="unit"
            value="%"
            :checked="target.unit === '%'"
            @change="handleUnitChange"
          />
          <label for="%" class="text-neutral-700">% (Percent)</label>
          <input
            type="radio"
            name="unit"
            value="custom"
            :checked="target.unit !== '%'"
            @change="handleUnitChange"
          />
          <label for="custom" class="text-neutral-700">Custom</label>
          <input
            type="text"
            v-model="customUnit"
            class="ml-2 w-[30px] text-center p-1 bg-slate-50 focus:outline-none font-semibold"
          />
        </div>
      </div>
      <div v-if="deadline">
        <span class="block mb-1">Deadline</span>
        <div class="flex gap-2 items-center">
          <label for="year" class="flex gap-2 items-center text-neutral-700">
            <input
              type="radio"
              name="deadline"
              value="year"
              id="year"
              :checked="deadline.type === 'year'"
              @change="updateDeadlineType"
            />
            Year
          </label>
          <label for="month" class="flex gap-2 items-center text-neutral-700">
            <input
              type="radio"
              name="deadline"
              value="month"
              id="month"
              :checked="deadline.type === 'month'"
              @change="updateDeadlineType"
            />
            Month
          </label>
          <label for="day" class="flex gap-2 items-center text-neutral-700">
            <input
              type="radio"
              name="deadline"
              value="day"
              id="day"
              :checked="deadline.type === 'day'"
              @change="updateDeadlineType"
            />
            Day
          </label>
        </div>
      </div>
      <div v-if="baseline">
        <span class="block mb-1">Baseline</span>
        <div class="flex gap-2 items-center">
          <label
            for="baseline-year"
            class="flex gap-2 items-center text-neutral-700"
          >
            <input
              type="radio"
              name="baseline"
              value="year"
              id="baseline-year"
              :checked="baseline.type === 'year'"
              @change="updateBaselineType"
            />
            Year
          </label>
          <label
            for="baseline-month"
            class="flex gap-2 items-center text-neutral-700"
          >
            <input
              type="radio"
              name="baseline"
              value="month"
              id="baseline-month"
              :checked="baseline.type === 'month'"
              @change="updateBaselineType"
            />
            Month
          </label>
          <label
            for="baseline-day"
            class="flex gap-2 items-center text-neutral-700"
          >
            <input
              type="radio"
              name="baseline"
              value="day"
              id="baseline-day"
              :checked="baseline.type === 'day'"
              @change="updateBaselineType"
            />
            Day
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      savedTargets: [],
      target: null,
      deadline: null,
      baseline: null,
      inputRef: null,
      customUnit: "km",
      showDropdown: false,
      dropdownOptions: [],
      inputValue: "",
    };
  },
  mounted() {
    this.inputRef = this.$refs.inputRef;
  },
  methods: {
    insertTarget() {
      this.target = {
        value: "",
        unit: "km",
      };
      this.inputValue = this.inputValue.replace("/", "");
    },
    insertDeadline() {
      this.deadline = {
        type: "year",
        value: 2024,
      };
      this.inputValue = this.inputValue.replace("/", "");
    },
    insertBaseline() {
      this.baseline = {
        value: "2023",
        type: "year",
      };
    },
    handleUnitChange(event) {
      const newUnit = event.target.value;
      this.target.unit = newUnit === "%" ? "%" : this.customUnit;
    },
    updateCustomUnit(ev) {
      this.customUnit = ev.target.value;
      if (this.target.unit !== "%") {
        this.target.unit = ev.target.value;
      }
    },
    updateDeadlineType(ev) {
      this.deadline.type = ev.target.value;
    },
    updateBaselineType(ev) {
      this.baseline.type = ev.target.value;
    },
    updateDeadlineValue(value) {
      this.deadline.value = value;
    },
    updateBaselineValue(value) {
      this.baseline.value = value;
    },
    resizable(el, factor) {
      const int = Number(factor) || 7.7;
      const resize = () => {
        if (el.value.length === 0) {
          el.style.width = "250px";
        } else {
          el.style.width = `${(el.value.length + 1) * int}px`;
        }
      };
      const events = "keyup,keypress,focus,blur,change".split(",");
      for (const event of events) {
        el.addEventListener(event, resize, false);
      }
      resize();
    },
    handleTargetValueChange(event) {
      let newValue = event.target.value;

      if (newValue.includes("/")) {
        const inputRect = this.inputRef.getBoundingClientRect();
        const caretPosition = newValue.indexOf("/");
        const left = inputRect.left + caretPosition * 10 + 5; // Adjust the position
        const top = inputRect.top + inputRect.height + 5;

        this.showDropdown = true;
        this.dropdownOptions = ["Insert target", "Insert deadline"];

        this.$nextTick(() => {
          const dropdownRef = this.$refs.dropdownRef;
          if (dropdownRef) {
            dropdownRef.style.left = `10px`;
            dropdownRef.style.top = `10px`;
          }
        });
      } else {
        this.showDropdown = false;
      }

      this.resizable(this.inputRef, 6.6);
    },
    addNewTarget(text) {
      this.savedTargets.push({
        text,
        target: this.target,
        deadline: this.deadline,
      });
      this.target = null;
      this.deadline = null;
      this.inputValue = "";
    },
    focusInput(event) {
      if (event.target === event.currentTarget) {
        this.inputRef.focus();
      }
    },
    hideDropdown() {
      this.showDropdown = false;
    },
  },
};
</script>

<style scoped>
/* Add your CSS styles here */
</style>
