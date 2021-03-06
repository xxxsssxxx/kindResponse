import { mount, createLocalVue } from "@vue/test-utils";

import BlurClosing from "@/directives/blurClosing.ts";
import { Side, State } from "@/enums/enums.ts";

import GetStarted from "@/components/GetStarted.vue";
import MainTitle from "@/components/MainTitle.vue";
import Chat from "@/components/Chat.vue";
import BaseAttribute from "@/components/Base/BaseAttribute.vue";
import BaseSelect from "@/components/Base/BaseSelect.vue";
import BaseBubble from "@/components/Base/BaseBubble.vue";
import BaseTooltip from "@/components/Base/BaseTooltip.vue";

import { mockFetchedCategories } from "@/test/mocks.ts";
const { fetchedOptions } = mockFetchedCategories();

const mockClipboard = jest.fn(x => x);
// Mock clibboard for jest
window.__defineGetter__("navigator", function() {
  return {
    clipboard: {
      writeText: () => mockClipboard()
    }
  };
});

const localVue = createLocalVue();

localVue.directive("blur-closing", BlurClosing);

describe("Snapshot tests", () => {
  describe("Get Started", () => {
    fetch.mockResponse(JSON.stringify(fetchedOptions));
    const wrapper = mount(GetStarted, { localVue });
    test("Should create a vue instance", () => {
      expect(wrapper.vm).toBeTruthy();
    });
    test("Renders correctly", () => {
      expect(wrapper.element).toMatchSnapshot();
    });
    test("Shows selected category", () => {
      wrapper.vm.selectCategory(fetchedOptions);
      expect(wrapper.element).toMatchSnapshot();
    });
    test("Emitted 'to' change", async() => {
      await wrapper.vm.handleToChange();
      expect(wrapper.element).toMatchSnapshot();
    });
    test("Emitted 'from' change", async() => {
      await wrapper.vm.handleFromChange();
      expect(wrapper.element).toMatchSnapshot();
    });
    test("Emitted 'response:get'", async() => {
      await wrapper.vm.getResponse();
      expect(wrapper.element).toMatchSnapshot();
    });
    test("Emitted 'category:select'", async() => {
      await wrapper.vm.getResponse();
      expect(wrapper.element).toMatchSnapshot();
    });
  });
  describe("Main Title", () => {
    const wrapper = mount(MainTitle, { localVue });
    test("Should create a vue instance", () => {
      expect(wrapper.vm).toBeTruthy();
    });
    test("Renders correctly", () => {
      expect(wrapper.element).toMatchSnapshot();
    });
  });
  describe("Base components", () => {
    describe("Attribute", () => {
      const wrapper = mount(BaseAttribute, {
        propsData: { type: "text" },
        directives: { "blur-closing": () => jest.fn() }
      });
      test("Should create a a vue instance", () => {
        expect(wrapper.vm).toBeTruthy();
      });
      test("Renders correctly", () => {
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Renders correctly with another type", async() => {
        await wrapper.setProps({ type: "select" });
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Renders correctly with default type", async() => {
        await wrapper.setProps({ type: "" });
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Select options", async() => {
        await wrapper.vm.optionSelected();
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Input changed", async() => {
        const input = wrapper.find("input#Lbl");
        await input.setValue("s");
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Empty input", async() => {
        const input = wrapper.find("input#Lbl");
        await input.setValue("");
        expect(wrapper.element).toMatchSnapshot();
      });
    });
    describe("Select", () => {
      const wrapper = mount(BaseSelect, { localVue });
      test("Should create a a vue instance", () => {
        expect(wrapper.vm).toBeTruthy();
      });
      test("Renders correctly", () => {
        expect(wrapper.element).toMatchSnapshot();
      });
      test("openDropDown => toggle showDropDown", async() => {
        const button = wrapper.find("button#dropdown-button");
        await button.trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Close dropdown on blur", () => {
        wrapper.vm.blurHandler();
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Click on option change selected", async() => {
        const option = wrapper.find("li#listbox-item-0");
        await option.trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.element).toMatchSnapshot();
      });
    });
    describe("Bubble", () => {
      const wrapper = mount(BaseBubble, { localVue });
      test("Should create a a vue instance", () => {
        expect(wrapper.vm).toBeTruthy();
      });
      test("Renders correctly", () => {
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Match after bubble mouseover", async() => {
        const bubble = wrapper.find(".bubble");
        await bubble.trigger("mouseover");
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Match after bubble mouseleave", async() => {
        const bubble = wrapper.find(".bubble");
        await bubble.trigger("mouseleave");
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Match after bubble click", async() => {
        const bubble = wrapper.find(".bubble");
        await bubble.trigger("click");
        expect(wrapper.element).toMatchSnapshot();
      });
    });
    describe("Tooltip", () => {
      const wrapper = mount(BaseTooltip, { localVue });
      test("Should create a a vue instance", () => {
        expect(wrapper.vm).toBeTruthy();
      });
      test("Renders correctly", () => {
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Set show to true", async() => {
        await wrapper.setProps({ show: true });
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Set state to success", async() => {
        await wrapper.setProps({ show: true, state: State.SUCCESS });
        expect(wrapper.element).toMatchSnapshot();
      });
      test("Set side to right", async() => {
        await wrapper.setProps({ show: true, side: Side.RIGHT });
        expect(wrapper.element).toMatchSnapshot();
      });
    });
  });
  describe("Chat", () => {
    const wrapper = mount(Chat, { localVue });
    test("Should create a vue instance", () => {
      expect(wrapper.vm).toBeTruthy();
    });
    test("Renders correctly", () => {
      expect(wrapper.element).toMatchSnapshot();
    });
    test("Renders correctly", async() => {
      await wrapper.vm.copyText();
      expect(wrapper.element).toMatchSnapshot();
    });
  });
});
