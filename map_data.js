"use strict";

//////////////////////////////////////////
// VARS
//////////////////////////////////////////

function map_data(){

	// class constructor
	class tile_class {
  		constructor(type, frequency, u, l, r, d){
    	this.type = type;
    	this.frequency = frequency;
    	this.u = u;
    	this.l = l;
    	this.r = r;
    	this.d = d;
  		}
	}

//////////////////////////////////////
//tile set 01 -- grass, water and sand
//////////////////////////////////////

	tile_objects_01[0] = new tile_class('G', 4, 
	['G', 'S', 'F', 'M'], // u
	['G', 'S', 'F', 'M'], // l
	['G', 'S', 'F', 'M'], // r
	['G', 'S', 'F', 'M'] // d
	); 

	tile_objects_01[1] = new tile_class('S', 1, 
	['G', 'S', 'W'], // u 
	['G', 'S', 'W'], // l
	['G', 'S', 'W'], // r
	['G', 'S', 'W'] // d
	);

	tile_objects_01[2] = new tile_class('W', 1, 
	['W', 'S'], // u
	['W', 'S'], // l
	['W', 'S'], // r
	['W', 'S'] // d
	);

	tile_objects_01[3] = new tile_class('F', 1, 
	['G', 'F'], // u 
	['G', 'F'], // l
	['G', 'F'], // r
	['G', 'F'] // d
	);

	tile_objects_01[4] = new tile_class('M', 1, 
	['G', 'F', 'M'], // u 
	['G', 'F', 'M'], // l
	['G', 'F', 'M'], // r
	['G', 'F', 'M'] // d
	);

}