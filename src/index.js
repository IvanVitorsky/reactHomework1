/** @jsx createVirtualNode **/
function createVirtualNode(type, props, ...children) {
	return { type, props, children };
}

function createElement(node) {
	if (typeof node === 'string') {
		return document.createTextNode(node);
	}

	const $element = document.createElement(node.type);
	node.children.map(createElement)
		.forEach($element.appendChild.bind($element));
	
	for (attribute in node.props){
		$element.setAttribute(attribute, node.props[attribute]);
	}
	return $element;
}

function updateElement(parent, newNode, oldNode, index = 0) {
	if (!oldNode) {
		parent.appendChild(createElement(newNode));
	}
	else if (!newNode) {
		parent.removeChild(parent.childNodes[index]);
	}
	else if (isChanged(newNode, oldNode)) {
		parent.replaceChild(createElement(newNode), parent.childNodes[index]);
	}
	else if (newNode.type) {
		const newLength = newNode.children.length;
		const oldLength = oldNode.children.length;

		for (let i = 0; i < newLength || i < oldLength; i++) {
			updateElement(parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
		}
	}
}

function isChanged(node1, node2) {
	console.log(node1.props, node2.props, isPropsChanged(node2.props, node1.props) ? 'changed' : 'not changed');
	return typeof node1 !== typeof node2
		|| typeof node1 === 'string' && node1 !== node2
		|| node1.type !== node2.type
		|| isPropsChanged(node1.props, node2.props);
}

function isPropsChanged(oldProps, newProps) {
	//null or undefined case
	if (oldProps == newProps)
		return false;

	//different props count -> changed
	if (Object.keys(oldProps).length !== Object.keys(newProps).length)
		return true;

	for (prop in oldProps)
	{
		if (!newProps.hasOwnProperty(prop))
			return true;
		
		//different values and not boolean attribute
		if (oldProps[prop] !== newProps[prop] && booleanAttributes.indexOf(prop) === -1)
			return true;

		//boolean attribute such as 'disabled', 'checked'
		if (oldProps[prop] !== newProps[prop] && booleanAttributes.indexOf(prop) > -1) {
			return isAttributeTrue(prop, oldProps[prop]) !== isAttributeTrue(prop, newProps[prop]);
		}
	}

	return false;
}

function isAttributeTrue(attributeName, attributeValue) {
	return attributeName === attributeValue || attributeValue === true || attributeValue === 'true';
}

const booleanAttributes = ['disabled', 'checked', 'selected'];

const dom1 = (
	<ul class="list">
		<li custAttr="abc2">item 1</li>
		<li ddd custAttr="true">item 2</li>
		<li style="color: #000000;">item 3</li>
		<li style="color: rebeccapurple;" custAttr="abc">item 4</li>
		<li checked>item 5</li>
		<li checked>item 6</li>
	</ul>
);

const dom2 = (
	<ul class="list">
		<li custAttr="abc" olol="" vvv>item 1</li>
		<li ddd custAttr>item 2</li>
		<li style="color: #FF0000;">item 3</li>
		<li style="color: rebeccapurple;" custAttr="abc">item 4</li>
		<li checked="true">item 5</li>
		<li checked="checked">item 6</li>
	</ul>
);
const $root = document.getElementById('root');
const $button = document.getElementById('button');

updateElement($root, dom1);

$button.addEventListener('click', () => {
	updateElement($root, dom2, dom1);
});
