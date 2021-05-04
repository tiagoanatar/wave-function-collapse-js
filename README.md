# Wave Function Collapse
Wave Function Collapse (WFC) is an constraint-based algorithm for which takes a small input image or tilemap and procedurally generating a larger image in the same style, such as: DeBroglie is stocked with loads of features to help customize the generation process.

<h3>My JavaScript Implemenation</h3>
My implementation use tile data in the format below. Each row(u, l, r and d) specify the allowed tiles for each direction.

-----
	tile_objects_01[0] = new tile_class('G', 4, 
	['G', 'S', 'F', 'M'], // u
	['G', 'S', 'F', 'M'], // l
	['G', 'S', 'F', 'M'], // r
	['G', 'S', 'F', 'M'] // d
	); 
-----

Check demo on fiddler:
https://jsfiddle.net/tiagort/hoj6daqm/5/

![alt text](https://i.postimg.cc/Ss72WzZK/mapwfc.png)
