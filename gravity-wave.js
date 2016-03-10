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
var gravity_wave_global_timeout = 3000;
var gravity_wave_bidder_timeout = [ ];
gravity_wave_bidder_timeout[ 'example_jsonp' ] = 300;
gravity_wave_bidder_timeout[ 'example_ajax' ]  = 30000000;
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
		console.log( "[GW]"+gravity_wave_date( )+" Global Timeout Reached" );
		for ( var i=0; i < gravity_wave_bidder_list.length; gravity_wave_bidder_list++ )
		{
			gravity_wave_bidder_status[ gravity_wave_bidder_list[ i ] ] = 0;
		}
		gravity_wave_end( );
	}, gravity_wave_global_timeout );


	// Initialize Example JSONP Header Tag
	if ( gravity_wave_enabled( "example_jsonp" ) )
	{
		gravity_wave_example_jsonp_start( );
		var gravity_wave_example_timeout = setTimeout( function( )
		{
			gravity_wave_bidder_status["example_jsonp"] = 0;
			gravity_wave_end( );
		}, gravity_wave_bidder_timeout[ "example_jsonp" ] );

		window.gravity_wave_example_jsonp_end = function( )
		{
			gravity_wave_bidder_status["example_jsonp"] = 0;
			console.log ( "[GW]"+gravity_wave_date()+" End Example JSONP" );
			clearTimeout( gravity_wave_example_timeout );
			gravity_wave_end( );
		}
	}

	// Initialize Example AJAX Header Tag
	if ( gravity_wave_enabled( "example_ajax" ) )
	{
		gravity_wave_example_ajax_start( gravity_wave_bidder_timeout[ 'example_ajax' ] );

		window.gravity_wave_example_ajax_end = function( )
		{
			gravity_wave_bidder_status["example_ajax"] = 0;
			console.log ( "[GW]"+gravity_wave_date()+" End Example AJAX" );
			clearTimeout( gravity_wave_example_timeout );
			gravity_wave_end( );
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

function gravity_wave_end( )
{

	clearTimeout( gravity_wave_global_timeout_thread );
	if ( ! gravity_wave_ready_state ) return;
	for ( var i=0; i < gravity_wave_bidder_list.length; gravity_wave_bidder_list++ )
	{
		if ( gravity_wave_bidder_status[ gravity_wave_bidder_list[ i ] ] != 0 )
		{
			console.log( "[GW]"+gravity_wave_date()+" Auction in progress" );
			return;
		}
	}
	if ( gravity_wave_bidder_status[ "example_ajax" ] == 1 || gravity_wave_bidder_status[ "example_ajax" ] == 1 )
	{
		return;
	}

	googletag.cmd.push(function() { 
		gravity_wave_set_targets( );
		console.log( "[GW]"+gravity_wave_date()+" Send in display call" );
		googletag.display('billboard');
	});

	gravity_wave_ready_state = 0;
	var gravity_wave_proc_time = ( gravity_wave_ts.pop( ) - gravity_wave_ts.shift( ) );
	console.log( "[GW]"+gravity_wave_date()+" End " + gravity_wave_proc_time + "ms" );
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
	console.log ( "[GW]"+gravity_wave_date()+" Start Example JSON" );
	var example_tag = document.createElement("script");
	example_tag.type = "text/javascript";
	//example_tag.src = 'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js';
	example_tag.src = 'https://as-sec.casalemedia.com/cygnus/?v=7&x3=1&fn=cygnus_index_parse_res&s=158710&r=%7B%22id%22%3A628222507%2C%22site%22%3A%7B%22page%22%3A%22http%3A%2F%2Fwww.cosmopolitan.com%2F%22%2C%22ref%22%3A%22%22%7D%2C%22imp%22%3A%5B%7B%22id%22%3A%221%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%221%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%222%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%222%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%223%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%223%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%224%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%224%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%225%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%225%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%226%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%226%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%227%22%2C%20%22banner%22%3A%7B%22w%22%3A970%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%227%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%228%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_1%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%229%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_2%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2210%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_3%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2211%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_4%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2212%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_5%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2213%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_6%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2214%22%2C%20%22banner%22%3A%7B%22w%22%3A970%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_7%22%2C%22siteID%22%3A164113%7D%7D%5D%7D';
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
	console.log ( "[GW]"+gravity_wave_date()+" Start Example AJAX" );
	var example_req = new XMLHttpRequest( );
	example_req.timeout = timeout;
	example_req.onreadystatechange = function( )
	{
		if ( example_req.readyState == 4 && example_req.status == 200 )
		{
//			window.res = eval( '('+example_req.responseText+');' );
			window.res = eval ( example_req.responseText.replace( "cygnus_index_parse_res", "" ) );
			gravity_wave_example_ajax_end( );
		}
	};
	example_req.ontimeout = function( )
	{
		console.log( "[GW]"+gravity_wave_date()+" Timeout Example AJAX" );
		gravity_wave_bidder_status["example_ajax"] = 0;
		gravity_wave_end( );
	};
	//example_req.open( "GET", "http://api.headertag.com/sample-res.json", true );
	example_req.open( "GET", "http://as.casalemedia.com/cygnus/?v=7&x3=1&fn=cygnus_index_parse_res&s=158710&r=%7B%22id%22%3A628222507%2C%22site%22%3A%7B%22page%22%3A%22http%3A%2F%2Fwww.cosmopolitan.com%2F%22%2C%22ref%22%3A%22%22%7D%2C%22imp%22%3A%5B%7B%22id%22%3A%221%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%221%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%222%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%222%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%223%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%223%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%224%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%224%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%225%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%225%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%226%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%226%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%227%22%2C%20%22banner%22%3A%7B%22w%22%3A970%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%227%22%2C%22siteID%22%3A158710%7D%7D%2C%7B%22id%22%3A%228%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_1%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%229%22%2C%20%22banner%22%3A%7B%22w%22%3A728%2C%22h%22%3A90%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_2%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2210%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_3%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2211%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_4%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2212%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_5%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2213%22%2C%20%22banner%22%3A%7B%22w%22%3A300%2C%22h%22%3A600%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_6%22%2C%22siteID%22%3A164113%7D%7D%2C%7B%22id%22%3A%2214%22%2C%20%22banner%22%3A%7B%22w%22%3A970%2C%22h%22%3A250%2C%22topframe%22%3A1%7D%2C%22ext%22%3A%20%7B%22sid%22%3A%22T1_7%22%2C%22siteID%22%3A164113%7D%7D%5D%7D", true );
	example_req.send();
}

function cygnus_index_parse_res( res )
{
	void( 0 );
}

//
// Start
// Include this start function in gallery, scroll & refresh events
//
gravity_wave_start( );
