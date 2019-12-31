class _Node {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(item){
        this.head = new _Node(item, this.head);
    }

    insertLast(item){
        if(this.head === null){
            this.insertFirst(item);
        }
        else{
            let tempNode = this.head;
            while(tempNode.next !== null){
                tempNode = tempNode.next;
            }
            tempNode.next = new _Node(item, null);
        }
    }
    /**Inserts a new node after a node containing the key.*/
    insertAfter(key, itemToInsert){
        let tempNode = this.head;
        while(tempNode !== null && tempNode.value !== key){
            tempNode = tempNode.next;
        } 
        if(tempNode !== null){
            tempNode.next = new _Node(itemToInsert, tempNode.next);
        }  
    }
    /* Inserts a new node before a node containing the key.*/
    insertBefore(key, itemToInsert){
        if(this.head == null){
            return;
        }
        if(this.head.value == key){
            this.insertFirst(itemToInsert);
            return;
        }
        let prevNode = null;
        let currNode = this.head;
        while(currNode !== null && currNode.value.memory_value < key){
            //console.log(currNode.value.memory_value);
            prevNode = currNode;
            currNode = currNode.next;
        }
        if(currNode === null){
            this.insertLast(itemToInsert);
            console.log('Inserting at Last position, all nodes have lower memory value');
            return;
        }
        //insert between current and previous
        prevNode.next = new _Node(itemToInsert, currNode);
    }
    insertAt(nthPosition, itemToInsert) {
        if (nthPosition < 0) {
            throw new Error('Position error');
        }
        if (nthPosition === 0) {
            this.insertFirst(itemToInsert);
        }else {
            // Find the node which we want to insert after
            const node = this._findNthElement(nthPosition - 1);
            const newNode = new _Node(itemToInsert, null);
            newNode.next = node.next; 
            node.next = newNode;
        }
    }
    _findNthElement(position) {
        let node = this.head;
        for (let i=0; i<position; i++) {
            node = node.next;
        }
        return node;
    }
    remove(item){ 
        //if the list is empty
        if (!this.head){
            return null;
        }
        //if the node to be removed is head, make the next node head
        if(this.head.value === item){
            let returnNode = this.head.value;
            this.head = this.head.next;
            return returnNode;
        }
        //start at the head
        let currNode = this.head;
        //keep track of previous
        let previousNode = this.head;
        while ((currNode !== null) && (currNode.value.id !== item)) {
            //save the previous node 
            previousNode = currNode;
            currNode = currNode.next;
        }
        if(currNode === null){
            console.log('Item not found');
            return;
        }
        previousNode.next = currNode.next;
    }
    find(key, value) { //get
        //start at the head
        let currNode = this.head;
        //if the list is empty
        if (!this.head){
            return null;
        }
        while(currNode.value[key].toString() !== value.toString()) {
            //return null if end of the list 
            // and the item is not on the list
            if (currNode.next === null) {
                return null;
            }
            else {
                //keep looking 
                currNode = currNode.next;
            }
        }
        //found it
        return currNode.value;
    }
}

function displayList(list){
    let currNode = list.head;
    while (currNode !== null) {
        console.log(currNode);
        currNode = currNode.next;
    }
}

function size(lst){
    let counter = 0;
    let currNode = lst.head;
    if(!currNode){
        return counter;
    }
    else
        counter++;
    while (!(currNode.next == null)) {
        counter++;
        currNode = currNode.next;
    }
    return counter;
}

function isEmpty(lst){
    let currNode = lst.head;
    if(!currNode){
        return true;
    }
    else {
        return false;
    }
}

function findPrevious(lst, item) {
    let currNode = lst.head;
    while ((currNode !== null) && (currNode.next.value !== item)) {
        currNode = currNode.next;
    }
    return currNode;
}

function findLast(lst){
    if(lst.head === null){
        return 'list is empty';
    } 
    let tempNode = lst.head;
    while(tempNode.next !== null){
        tempNode = tempNode.next;
    }
      return tempNode;
}

function mergeSort(list) { 
    // if (list.next === null) 
    //     return list; 

    let count = 0; 
    let countList = list;
    let leftPart = list; 
    let leftPointer = list; 
    let rightPart = null; 
    let rightPointer = null; 
    console.log('countList',countList); 
    // Counting the nodes in the received linked list 
    while (countList.next !== undefined && countList !== null) {
        console.log(count);
        count++; 
        countList = countList.next; 
    } 

    // counting the mid of the linked list 
    let mid = Math.floor(count / 2);
    let count2 = 0; 

    // separating the left and right part with 
    // respect to mid node in tke linked list 
    while (count2 < mid) { 
        count2++; 
        leftPointer = leftPointer.next; 
    } 

    rightPart = new LinkedList(leftPointer.next); 
    leftPointer.next = null; 

    // Here are two linked list which 
    // contains the left most nodes and right 
    // most nodes of the mid node 
    return this._mergeSort(this.mergeSort(leftPart), 
                           this.mergeSort(rightPart.head)); 
} 

// Merging both lists in sorted manner 
function _mergeSort(left, right) { 

    // Create a new empty linked list 
    let result = new LinkedList(); 

    let resultPointer = result.head; 
    let pointerLeft = left; 
    let pointerRight = right; 

      
    // If true then add left most node value in result, 
    // increment left pointer else do the same in 
    // right linked list. 
    // This loop will be executed until pointer's of 
   // a left node or right node reached null 
    while (pointerLeft && pointerRight) { 
        let tempNode = null; 
        let tempNodeNextValue = null;
       // Check if the right node's value is greater than 
       // left node's value 
        if (pointerLeft.node.value.memory_value > pointerRight.node.value.memory_value) { 
            tempNode = pointerRight.node;
            tempNodeNextValue = pointerRight.node.value.next;
            pointerRight = pointerRight.next; 
            pointerRight.value.next = tempNodeNextValue;
        } 
        else { 
            tempNode = pointerLeft.node; 
            tempNodeNextValue = pointerLeft.node.value.next;
            pointerLeft = pointerLeft.next; 
            pointerLeft.value.next = tempNodeNextValue;
        } 

        if (result.head == null) { 
            result.head = new Node(tempNode); 
            resultPointer = result.head; 
        } 
        else { 
            resultPointer.next = new Node(tempNode); 
            resultPointer = resultPointer.next; 
        } 
    } 

    // Add the remaining elements in the last of resultant 
    // linked list 
    resultPointer.next = pointerLeft; 
    while (resultPointer.next) 
        resultPointer = resultPointer.next; 

        resultPointer.next = pointerRight; 

    // Result is  the new sorted linked list 
     return result.head; 
} 
module.exports = {
    LinkedList, 
    displayList, 
    findLast, 
    findPrevious,
    isEmpty, 
    mergeSort,
    size} ;