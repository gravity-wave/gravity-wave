/////////////////////////////////////////////////////////
//
// Gravity Wave 0.1 alpha
//
// http://www.gravity-wave.org  //  ©2016 Earth
//
/////////////////////////////////////////////////////////

//
//   Configure Timeouts & Globals
//
var gravity_wave_ts = [ ];
var gravity_wave_alarms = [ ];
var gravity_wave_divs = [ 'billboard' ];
var gravity_wave_global_timeout = 300;
var gravity_wave_bidder_timeout = [ ];
gravity_wave_bidder_timeout[ 'example' ] = 250;
var gravity_wave_bidder_list = [ ];
var gravity_wave_bidder_status = [ ];

function gravity_wave_start( callback )
{
	console.log( "[GW]"+gravity_wave_date()+" Start" );

	// Configure Bidder List
	gravity_wave_ready_state = 1;
	gravity_wave_bidder_list = [ "example" ];


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

	// Initialize Example Header Tag
	if ( gravity_wave_enabled( "example" ) )
	{
		gravity_wave_example_start( );
		console.log ( "[GW]"+gravity_wave_date()+" Start Example" );
		var gravity_wave_example_timeout = setTimeout( function( )
		{
			gravity_wave_bidder_status["example"] = 0;
			gravity_wave_end( callback );
		}, gravity_wave_bidder_timeout[ "example" ] );

		window.gravity_wave_example_end = function( )
		{
			gravity_wave_bidder_status["example"] = 0;
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

function gravity_wave_example_onload ( ) {
	window.googletag = window.googletag || {};
	googletag.cmd = googletag.cmd || [];
	googletag.cmd.push(function ( ) {
		googletag.pubads().setTargeting( "GravityWave", "Global" );
		console.log( "[GW]"+gravity_wave_date()+" Example Global Target" );
	});
	gravity_wave_example_end( );
}

function gravity_wave_example_start( network_id )
{
	var example_tag = document.createElement("script");
	example_tag.type = "text/javascript";
	example_tag.src = 'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular.min.js';
	example_tag.onload = gravity_wave_example_onload;
	var node = document.getElementsByTagName("script")[0];
	node.parentNode.insertBefore(example_tag, node);
}

//
// Start
// Include this start function in gallery, scroll & refresh events
//
gravity_wave_start( );
