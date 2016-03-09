/////////////////////////////////////////////////////////
//
// Gravity Wave 0.1 alpha
// The MIT License (MIT)
// http://www.gravity-wave.org  //  (C) 2016 Earth
//
// Permission is hereby granted, free of charge, to any
// person obtaining a copy of this software and
// associated documentation files (the "Software"), to
// deal in the Software without restriction, including
// without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom
// the Software is furnished to do so, subject to the
// following conditions:
// 
// The above copyright notice and this permission notice
// shall be included in all copies or substantial
// portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
// ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
// LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
// FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
// AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// 

//
//   Configure Timeouts & Globals
//
var gravity_wave_ts = [ ];
var gravity_wave_alarms = [ ];
var gravity_wave_divs = [ 'billboard' ];
var gravity_wave_global_timeout = 300;
var gravity_wave_bidder_timeout = [ ];
gravity_wave_bidder_timeout[ 'example_jsonp' ] = 250;
gravity_wave_bidder_timeout[ 'example_ajax' ]  = 250;
var gravity_wave_bidder_list = [ ];
var gravity_wave_bidder_status = [ ];

function gravity_wave_start( callback )
{
	console.log( "[GW]"+gravity_wave_date()+" Start" );

	// Configure Bidder List
	gravity_wave_ready_state = 1;
	gravity_wave_bidder_list = [ "example_jsonp", "example_ajax" ];


	for ( var i=0; i < gravity_wave_bidder_list.length; i++ )
	{
		gravity_wave_bidder_status[ gravity_wave_bidder_list[ i ] ] = 1;
	}

	// Implement Global Timeout
	window.gravity_wave_global_timeout_thread = setTimeout( function( )
	{
		for ( var i=0; i < gravity_wave_bidder_list.length; gravity_wave_bidder_list++ )
		{
			gravity_wave_bidder_status[ gravity_wave_bidder_list[ i ] ] = 0;
		}
		gravity_wave_end( callback );
	}, gravity_wave_global_timeout );

	// Initialize Example JSONP Header Tag
	if ( gravity_wave_enabled( "example_jsonp" ) )
	{
		gravity_wave_example_jsonp_start( );
		var gravity_wave_example_timeout = setTimeout( function( )
		{
			gravity_wave_bidder_status["example_jsonp"] = 0;
			gravity_wave_end( callback );
		}, gravity_wave_bidder_timeout[ "example_jsonp" ] );

		window.gravity_wave_example_jsonp_end = function( )
		{
			gravity_wave_bidder_status["example_jsonp"] = 0;
			console.log ( "[GW]"+gravity_wave_date()+" End Example" );
			clearTimeout( gravity_wave_example_timeout );
			gravity_wave_end( callback );
		}
	}

	// Initialize Example AJAX Header Tag
	if ( gravity_wave_enabled( "example_ajax" ) )
	{
		gravity_wave_example_ajax_start( );
		var gravity_wave_example_timeout = setTimeout( function( )
		{
			gravity_wave_bidder_status["example_ajax"] = 0;
			gravity_wave_end( callback );
		}, gravity_wave_bidder_timeout[ "example_ajax" ] );

		window.gravity_wave_example_ajax_end = function( )
		{
			gravity_wave_bidder_status["example_ajax"] = 0;
			console.log ( "[GW]"+gravity_wave_date()+" End Example" );
			clearTimeout( gravity_wave_example_timeout );
			gravity_wave_end( callback );
		}
	}
}

function gravity_wave_set_targets( )
{
	var slot_map = googletag.pubads().getSlotIdMap();
	for ( var i=0; i < gravity_wave_divs.length; i++ )
	{
		var slot = gravity_wave_slot_from_div( slot_map, gravity_wave_divs[ i ] );

		// Map Example Slots
		if ( gravity_wave_divs[ i ] == "billboard" )
		{
			slot.setTargeting( "GravityWave", "Slot" );
		}
	}
}

function gravity_wave_end( callback )
{
	if ( ! gravity_wave_ready_state ) return;
	for ( var i=0; i < gravity_wave_bidder_list.length; gravity_wave_bidder_list++ )
	{
		if ( gravity_wave_bidder_status[ gravity_wave_bidder_list[ i ] ] != 0 )
		{
			console.log( "[GW]"+gravity_wave_date()+" Auction in progress" );
			return;
		}
	}

	googletag.cmd.push(function() { 
		gravity_wave_set_targets( );
		console.log( "[GW]"+gravity_wave_date()+" Send in display call" );
		googletag.display('billboard');
	});

	gravity_wave_ready_state = 0;
	var gravity_wave_proc_time = ( gravity_wave_ts.pop( ) - gravity_wave_ts.shift( ) );
	console.log( "[GW]"+gravity_wave_date()+" End " + gravity_wave_proc_time + "ms" );
	if ( typeof callback === "function" ) callback( );
}

//
// Helper Functions
//
function gravity_wave_enabled( bidder )
{
	for ( var i=0; i < gravity_wave_bidder_list.length; i++ )
	{
		if ( gravity_wave_bidder_list[ i ] == bidder )
		{
			return true;
		}
	}
	return false;
}

function gravity_wave_slot_from_div( s, d )
{
	for ( var i in s )
	{
		var div = s[i].getSlotElementId( );
		if ( div == d )
		{
			return s[ i ];
		}
	}
}

function gravity_wave_date( )
{
	var d = new Date( );
	gravity_wave_ts.push( Number( d ) );
	return d.getTime( );
}

//
// External Libraries
//


function gravity_wave_example_jsonp_start( network_id )
{
	console.log ( "[GW]"+gravity_wave_date()+" Start Example" );
	var example_tag = document.createElement("script");
	example_tag.type = "text/javascript";
	example_tag.src = 'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js';
	example_tag.onload = function( )
	{
		window.googletag = window.googletag || {};
		googletag.cmd = googletag.cmd || [];
		googletag.cmd.push(function ( ) {
			googletag.pubads().setTargeting( "GravityWave", "Global" );
			console.log( "[GW]"+gravity_wave_date()+" Example Global Target" );
		});
		gravity_wave_example_jsonp_end( );
	}
	var node = document.getElementsByTagName("script")[0];
	node.parentNode.insertBefore(example_tag, node);
}

function gravity_wave_example_ajax_start( timeout )
{
	var example_req = new XMLHttpRequest( );
	example_req.timeout = timeout;
	example_req.onreadystatechange = function( )
	{
		if ( example_req.readyState == 4 && example_req.status == 200 )
		{
			var res = example_req.responseText;
			console.log( "[GW]"+gravity_wave_date()+" Example AJAX Ack" );
			gravity_wave_example_ajax_end( );
		}
	};
	example_req.onreadystatechange = function( )
	{
		console.log( "[GW]"+gravity_wave_date()+" Example AJAX Timeout" );
	};
	example_req.open( "GET", "http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js", true );
	example_req.send();
}


//
// Start
// Include this start function in gallery, scroll & refresh events
//
gravity_wave_start( );
