//Class to handle slots
class Slots {
    getSlots(template) {
        return template.content.querySelectorAll('slot');
    }

    getSlotNames(slots) {
        let slotNames = [];

        slots.forEach((slot) => {
            slotNames.push(slot.getAttribute('name'));
        });

        return slotNames;
    }

    getSlotOwners(ele) {
        return ele.querySelectorAll('[slot]');
    }
}

//get all template elements
const templates = document.querySelectorAll('template');

templates.forEach((template, key) => {
    const elementName = template.getAttribute('comp');

    const props = template.getAttributeNames();

    const index = props.indexOf('comp');

    props.splice(index, 1);

    //only continue if template has attribute "comp"

    if(!elementName) {
        return;
    }

    //get the template code
    const inner = template.innerHTML;

    //to avoid componentnames to override native html elements, components must have underscore at the end.
    //this get all components of this template type
    const elements = document.querySelectorAll(elementName + '_');

    const slots = new Slots();

    //first, get all slot elements in the template
    const templateSlots = slots.getSlots(template);

    //get the names of these slot (attribute: name) to find the right html to replace with
    const templateSlotNames = slots.getSlotNames(templateSlots);

    //create all components
    elements.forEach((component, thiskey) => {
        //slot owners are the elements that are to replace with the <slot> tag in the template
        const slotOwners = [...slots.getSlotOwners(component)];

        //now put all the templates code inside the component
        component.innerHTML = inner;

        //replace all slots with the correspoding elements
        for (let slotIndex = 0; slotIndex < templateSlotNames.length; slotIndex++) {
            //finds the corresponding element
            const toReplace = slotOwners.find(owner => owner.getAttribute('slot') === templateSlotNames[slotIndex]);

            //if no corresponding could be found, check if fallback is given
            if(!toReplace) {
                //if fallback is not given, throw error
                if(templateSlots[slotIndex].innerHTML === "") {
                    throw Error(`Slot "${templateSlotNames[slotIndex]}" expected. None given in component: ${component.tagName}`)
                }

                //else, replace with fallback
                component.querySelector(`slot[name="${templateSlotNames[slotIndex]}"]`).replaceWith(templateSlots[slotIndex].innerHTML);
            }else {
                //replace
                component.querySelector(`slot[name="${templateSlotNames[slotIndex]}"]`).replaceWith(toReplace);
            }
        }

        console.log(props);
        //props 
        for (let attrIndex = 0; attrIndex < props.length; attrIndex++) {
            let prop = component.getAttribute(props[attrIndex]);

            //default value for prop, if prop not defined
            const defaultAttrValue = template.getAttribute(props[attrIndex]);

            //if prop not defined
            if(!prop) {
                //check if default value for prop exists
                if(defaultAttrValue !== "") {
                    //if so, append default value
                    prop = defaultAttrValue;
                }else {
                    //if not, thats an erro
                    throw Error(`Prop ${props[attrIndex]} expected. None given in component: ${component.tagName}`);
                }
            }

            console.log(props[attrIndex].toLowerCase());
            //replace all prop values. Inside the template, prop values are recognised by {}
            component.innerHTML = component.innerHTML.replaceAll(`{${props[attrIndex]}}`, prop);    
        }
    });
});