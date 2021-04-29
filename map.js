"use strict";

//////////////////////////////////////////
// VARS
//////////////////////////////////////////

const MAP_SIZE_X = 20;
const MAP_SIZE_Y = 20;
const MAP_SIZE_X_b = 60; // complex strcutures
const MAP_SIZE_Y_b = 60; // complex strcutures
let map = [];
let map_b = []; // complex strcutures
let map_id = 0;

// sample array

// G - grass
// S - sand
// W - water

let prototype_01 = [
['G', 'G', 'G', 'G', 'G', 'G'],
['G', 'G', 'S', 'S', 'G', 'G'],
['G', 'S', 'W', 'W', 'S', 'G'],
['G', 'S', 'W', 'W', 'S', 'G'],
['G', 'G', 'S', 'S', 'G', 'G'],
['G', 'G', 'G', 'G', 'G', 'G']
];

// object array
let tile_objects_01 = [];

/* distance of 2 points */
function distance(x1, x2, y1, y2){ 
	let a = x1 - x2;
	let b = y1 - y2;
	let c = Math.sqrt( a*a + b*b );
	return c;
}

///////////////////////////////////////////
// FEED OBJECT TABLE
///////////////////////////////////////////

function tile_object_gen(){

// map tileset options
map_data()

}

///////////////////////////////////////////
// MAP LOAD
///////////////////////////////////////////

// class constructor
class map_gen {
  	constructor(final, y, x, id, vari, collapse){
    this.final = final;
    this.y = y;
    this.x = x;
    this.id = id;
    this.vari = vari;
    this.collapse = collapse;
  	}
}

function map_load(){

	// activation of all blocks area
	let active = false;

	// SIMPLE - map object array creation
	for(var i = 0; i < MAP_SIZE_Y; i++){
			map[i] = [];
		for(var j = 0; j < MAP_SIZE_X; j++){

			map[i][j] = new map_gen('X', i, j, map_id, []);

			for(var w = 0; w < tile_objects_01.length; w++){
				map[i][j].vari[w] = tile_objects_01[w]; 
			}

			map_id = map_id + 1;

		}
	}

	map_id = 0;

	// COMPLEX - map object array creation - complex strcutures
	for(var i = 0; i < MAP_SIZE_Y_b; i++){
			map_b[i] = [];
		for(var j = 0; j < MAP_SIZE_X_b; j++){

			map_b[i][j] = new map_gen('X', i, j, map_id, []);

			map_id = map_id + 1;

		}
	}

	map_id = 0;

}

///////////////////////////////////////////
// CHECK IF MAP CELS HAVE MORE THAN 1 VARIATION AVALIBLE
///////////////////////////////////////////

function check_cels(){

	for(var i = 0; i < MAP_SIZE_Y; i++){
		for(var j = 0; j < MAP_SIZE_X; j++){
			if (map[i][j].collapse != true){ // map[i][j].vari.length > 1 || map[i][j].final == 'X'
				return false;
			}
		}
	}

	return true;

}

///////////////////////////////////////////
// MAP CELLS INTERATOR
// determine smallest entropy(random options avalible) cell, choose a random value from it 
// and save curent y and x
///////////////////////////////////////////

let current_y = 0;
let current_x = 0;
let pick_smallest = 0;

function interator(){

	let random_stack = [];
	let temp_index = [];
	let rand = 0;

	// class constructor
	class vari_list {
  		constructor(table){
    	this.table = table;
  		}
	}

	// search for smallest item
	vari_list.prototype.hasMin = function(attrib) {
    	return (this.table.length && this.table.reduce(function(prev, curr){ 
        	return prev[attrib] < curr[attrib] ? prev : curr; 
    	})) || null;
 	}

 	random_stack = new vari_list([]);

 	// feed temporary table
	for(var i = 0; i < MAP_SIZE_Y; i++){
		for(var j = 0; j < MAP_SIZE_X; j++){
			if (map[i][j].collapse != true){ // thus he will not get tiles that already collapse to 1 option
				random_stack.table.push({size: map[i][j].vari.length, y: i, x: j});
			}
		}
	}

	// smallest result
	pick_smallest = random_stack.hasMin('size');

	// feed index that will be chosen by random
	for(var w = 0; w < random_stack.table.length; w++){
		if (pick_smallest.size == random_stack.table[w].size){
			temp_index.push([random_stack.table[w].y, random_stack.table[w].x]);
		}
	}

	rand = Math.floor(Math.random() * temp_index.length);

	if (temp_index.length > 0){
		current_y = temp_index[rand][0];
		current_x = temp_index[rand][1]; 
	}

}

///////////////////////////////////////////
// COLLAPSE AT - Reduz variantes possiveis do current para 1
///////////////////////////////////////////

function colapse_at(y, x){

	let rand = 0;
	let rand_array = [];

	if (map[y][x].collapse != true && map[y][x].vari.length > 1){ // map[y][x].collapse != true -- map[y][x].vari.length > 1

		// chosing random tile - based on frequency 
		for(var i = 0; i < map[y][x].vari.length; i++){
			for(var f = 0; f < map[y][x].vari[i].frequency; f++){
				rand_array.push(i);
			}
		}

		rand = Math.floor(Math.random() * rand_array.length);

		// delete uneded tiles
		for(var i = 0; i < map[y][x].vari.length; i++){
			if (rand_array[rand] != i){
				delete map[y][x].vari[i];
			}
		}

		// removing undefined items
   		for(var i = 0; i < map[y][x].vari.length; i++){                            
        	if (map[y][x].vari[i] == undefined) { 
            	map[y][x].vari.splice(i, 1); 
            	i--; 
        	}
    	}

	}

	// collapse all that have just 1 variation
	for(var i = 0; i < MAP_SIZE_Y; i++){
		for(var j = 0; j < MAP_SIZE_X; j++){
			if (map[i][j].vari.length == 1){
				map[i][j].final = map[i][j].vari[0];
				map[i][j].collapse = true;
			}
		}
	}

}

///////////////////////////////////////////
// PROPAGATE
///////////////////////////////////////////

let temp_array = [];

function propagate(y, x){

	let stack = [];
	stack[stack.length] = [y, x];
	
	// loop
	while (stack.length > 0){

		let temp_y = stack[stack.length-1][0];
		let temp_x = stack[stack.length-1][1];

		let item_changed = false;

		// remove the current_y/x item that just add
		stack.pop();

		// compare variation lists and eliminate unnecessary ones
		for(var i = 0; i < MAP_SIZE_Y; i++){
			for(var j = 0; j < MAP_SIZE_X; j++){

				if (distance(temp_y, i, temp_x, j) == 1 && map[i][j].collapse != true){  // map[i][j].vari.length > 1

					for(var w = 0; w < map[temp_y][temp_x].vari.length; w++){
						for(var p = 0; p < map[i][j].vari.length; p++){
							// up
							if (i < temp_y){ 
								if (map[temp_y][temp_x].vari[w].u.includes(map[i][j].vari[p].type) == true){ 
   	   								temp_array.push(map[i][j].vari[p].type);
								}
							}
							// left
							if (j < temp_x){ 
								if (map[temp_y][temp_x].vari[w].l.includes(map[i][j].vari[p].type) == true){ 
   	   								temp_array.push(map[i][j].vari[p].type);
								}
							}
							// right
							if (j > temp_x){ 
								if (map[temp_y][temp_x].vari[w].r.includes(map[i][j].vari[p].type) == true){ 
   	   								temp_array.push(map[i][j].vari[p].type);
								}
							}
							// down
							if (i > temp_y){ 
								if (map[temp_y][temp_x].vari[w].d.includes(map[i][j].vari[p].type) == true){ 
   	   								temp_array.push(map[i][j].vari[p].type);
								}
							}
						} // for loop
					} // for loop

					// eliminating items before the next loop starts
					for(var z = 0; z < map[i][j].vari.length; z++){
						if (temp_array.includes(map[i][j].vari[z].type) == false && map[i][j].vari.length > 1){
							map[i][j].vari.splice(z, 1); 
							item_changed = true;
       	    				z--;
						}
					}

					if (item_changed == true){
						stack.push([i, j]); // save index to keep using the while loop
						item_changed = false; 
					}
					
					temp_array.length = 0; // clean table
				
				} // distance if

			} // for loop
		} // for loop
		

	}// while end

}

///////////////////////////////////////////
// MAIN WHILE
///////////////////////////////////////////

function main_while(){

	while (check_cels() == false){
		interator();
		colapse_at(current_y, current_x);
		propagate(current_y, current_x);
	}

}

//////////////////////////////////////////////////////////////
// PRE DRAW
/////////////////////////////////////////////////////////////

function predraw_block(){

	let main = document.querySelector('.map');

	for(var i = 0; i < MAP_SIZE_Y; i++){
		for(var j = 0; j < MAP_SIZE_X; j++){

			function id_name(ttype){return 'map_grid '+ttype}

			let div = document.createElement('div');
			div.setAttribute('data-id', map[i][j].id);
			div.setAttribute('data-y', map[i][j].y);
			div.setAttribute('data-x', map[i][j].x);

			div.className = id_name('blank');
			main.appendChild(div);

		}
	}

}

//////////////////////////////////////////////////////////////
// BLOCKS DRAW
/////////////////////////////////////////////////////////////

function draw_block(){

	let main = document.querySelector('.map');

	for(var i = 0; i < MAP_SIZE_Y; i++){
		for(var j = 0; j < MAP_SIZE_X; j++){

			let div = document.querySelectorAll('.map_grid')[map[i][j].id];
			div.setAttribute('data-type', map[i][j].final.type);

			// tile set 01

			if (map[i][j].final.type == 'G') {
				div.classList.toggle('mg_grass');
				div.classList.remove('blank');
			}

			if (map[i][j].final.type == 'S') {
				div.classList.toggle('mg_sand');
				div.classList.remove('blank');
			}

			if (map[i][j].final.type == 'W') {
				div.classList.toggle('mg_water');
				div.classList.remove('blank');
			}

			if (map[i][j].final.type == 'F') {
				div.classList.toggle('mg_forest');
				div.classList.remove('blank');
			}

			if (map[i][j].final.type == 'M') {
				div.classList.toggle('mg_mountain');
				div.classList.remove('blank');
			}

			if (map[i][j].final == 'X') {
				div.classList.toggle('empty');
				div.classList.remove('blank');
			}	

		}
	}

} 