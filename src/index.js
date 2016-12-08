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
		console.log('dom was changed');
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
	console.log(node1.props, node2.props);
	//console.log(node2.props);
	console.log(isPropsChanged(node2.props, node1.props));
	return typeof node1 !== typeof node2
		|| typeof node1 === 'string' && node1 !== node2
		|| node1.type !== node2.type
		|| isPropsChanged(node1.props, node2.props);
}

function isPropsChanged(firstProps, secondProps) {
	//null or undefined case
	if (firstProps == secondProps)
		return false;

	//different props count -> changed
	if (Object.keys(firstProps).length !== Object.keys(secondProps).length)
		return true;

	for (prop in firstProps)
	{
		if (!secondProps.hasOwnProperty(prop))
			return true;

		if (firstProps[prop] !== secondProps[prop])
			return true;
	}

	return false;
}

const dom1 = (
	<ul class="list">
		<li custAttr="abc2">item 1</li>
		<li ddd enabled="true">item 2</li>
		<li style="color: #000000;">item 3</li>
		<li style="color: rebeccapurple;" custAttr="abc">item 4</li>
	</ul>
);

const dom2 = (
	<ul class="list">
		<li custAttr="abc" olol="" vvv>item 1</li>
		<li ddd enabled>item 2</li>
		<li style="color: #FF0000;">item 3</li>
		<li style="color: rebeccapurple;" custAttr="abc">item 4</li>
	</ul>
);
const $root = document.getElementById('root');
const $button = document.getElementById('button');

updateElement($root, dom1);

$button.addEventListener('click', () => {
	updateElement($root, dom2, dom1);
});
