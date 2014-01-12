$(document).ready(function() 
{
	// Daily table sorter

	$('#daily-stats').stupidtable(); 

	// Redirect link on date drop down menu

	$('.date-drop-down').change(function() 
	{
		window.location = $(this).val();
	});

	// Daily options

	function get_options()
	{
		var options = new Object();

		options['position'] = get_position();

		options['teams'] = get_teams();
		options['chosen_team'] = $('.team-drop-down').val();

		options['salary'] = $('.salary-input').val();
		options['salary-toggle'] = $('input:radio[name=salary-toggle]:checked').val();

		options['starters-toggle'] = $('input:radio[name=starters-toggle]:checked').val();
		options['starters-toggle-headline'] = get_starters_toggle_headline(options['starters-toggle']);

		return options;
	}

	function get_position()
	{
		var position = $('.position-drop-down').val();
		if (position == 'all') { return 'all'; }
		if (position == 'forward') { return 'position-F'; }
		if (position == 'guard') { return 'position-G'; }
		if (position == 'center') { return 'position-C'; }			
	}

	function get_teams()
	{
		var teams = new Array();

		$(".game-button.show-game").each(function(index) 
		{
			var two_teams = $(this).text();

			var team = get_teams_in_game(two_teams);

			teams.push(team[1]);
			teams.push(team[2]);
		});	

		return teams;
	}

	function get_teams_in_game(two_teams)
	{
		var team = new Object();
		team[1] = two_teams.split(/ vs /)[0];
		team[2] = two_teams.split(/ vs /)[1];

		return team;
	}

	function options_change()
	{
		var options = get_options();

		$('.show-row').removeClass('show-row').addClass('hide-row');

		if (options['position'] == 'all')
		{
			var position_class = '';
		}
		else
		{
			var position_class = '.'+options['position'];
		}

		var row_data = $('.row-info').map(function() 
		{
		    return $(this).data('salary');
		}).get();

		for (var i = 0; i < row_data.length; i++) 
		{
			if (options['salary-toggle'] == 'greater-than')
			{
				if (row_data[i] >= options['salary'])
				{
					$('[data-salary="'+row_data[i]+'"]').addClass('valid-salary');
				}
				else
				{
					$('[data-salary="'+row_data[i]+'"]').removeClass('valid-salary');
				}

				continue;
			}

			if (options['salary-toggle'] == 'less-than')
			{
				if (row_data[i] <= options['salary'])
				{
					$('[data-salary="'+row_data[i]+'"]').addClass('valid-salary');
				}
				else
				{
					$('[data-salary="'+row_data[i]+'"]').removeClass('valid-salary');
				}
			}				
		};

		if (options['chosen_team'] == 'all')
		{
			$('.team-info').hide();

			for (var i=0; i < options['teams'].length; i++) 
			{
				$('.'+options['teams'][i]+position_class+'.valid-salary').removeClass('valid-salary').addClass('show-row').removeClass('hide-row');
			};	
		}
		else
		{
			$('.'+options['chosen_team']+position_class+'.valid-salary').removeClass('valid-salary').addClass('show-row').removeClass('hide-row');

			// Team links

			var rotoworld_team_abbr = change_abbr_for_rotoworld(options['chosen_team']);
			var rotoworld_team_link = 'http://www.rotoworld.com/teams/clubhouse/nba/'+rotoworld_team_abbr;

			var espn_team_schedule_link = 'http://espn.go.com/nba/teams/schedule?team='+options['chosen_team'];

			$('a.rotoworld-team-link').attr('href', rotoworld_team_link);
			$('a.espn-team-schedule-link').attr('href', espn_team_schedule_link);

			$('.team-info').show();		
		}

		show_or_hide_rows();
	}

	function show_hide_team_drop_down_options(toggle, team)
	{
		$(".team-drop-down option").each(function()
		{
		    var team_in_drop_down = $(this).val();

		    for (var i = 1; i <= 2; i++) 
		    {
		    	if (team[i] == team_in_drop_down)
		    	{
		    		if (toggle == 'show') { $(this).show(); }
		    		if (toggle == 'hide') { $(this).hide(); }
		    	}
		    }
		});			
	}

	function show_or_update_rotations()
	{
		var options = get_options();

		var chosen_date = $('.date-drop-down option:selected').text();

    	$.ajax
	    ({
            url: 'http://localhost/dfsnbatools/daily/get_team_rotation/'+options['chosen_team']+'/'+chosen_date,
            type: 'POST',
            dataType: 'json',
            success: function(games)
            {
            	var rotation_dates = [];
            	var distinct_players = [];

            	for (var i = 0; i < games.length; i++) 
            	{
            		rotation_dates.push(games[i][0].date);

            		for (var n = 0; n < games[i].length; n++) 
            		{
            			var index = distinct_players.indexOf(games[i][n].name);

            			if (index == -1)
            			{
            				distinct_players.push(games[i][n].name);
            			}
            		};
            	};

            	var player_data = [];

				for (var num = 0; num < distinct_players.length; num++) 
				{
					var minutes = [];
					var starter = [];

	            	for (var i = 0; i < games.length; i++) 
	            	{
	            		for (var n = 0; n < games[i].length; n++) 
	            		{
		            		if (distinct_players[num] == games[i][n].name && games[i][n].minutes != null)
							{
								if (options['starters-toggle'] == 'starters-and-bench')
								{
									if (games[i][n].starter == 'yes')
									{
										minutes.push({y: parseFloat(games[i][n].minutes),
															marker: {symbol: 'url(http://localhost/dfsnbatools/img/sport-basketball-icon.png)'}
														})
									}
									else
									{
										minutes.push(parseFloat(games[i][n].minutes));
									}
								}
								else if (options['starters-toggle'] == 'only-starters')
								{
									if (games[i][n].starter == 'yes')
									{
										minutes.push(parseFloat(games[i][n].minutes));
									}
								}
								else if (options['starters-toggle'] == 'only-bench')
								{
									if (games[i][n].starter == 'no')
									{
										minutes.push(parseFloat(games[i][n].minutes));
									}											
								}

								break;
							}				            			
						}

						if (i == minutes.length)
						{
							minutes.push(null);
						}
					}

					player_data.push({name: distinct_players[num], 
            							data: minutes});
				};

				var series_data = [];

				for (var i = 0; i < player_data.length; i++) 
				{
					var count = 0;

					for (var n = 0; n < player_data[i].data.length; n++) 
					{
						if (player_data[i].data[n] == null || player_data[i].data[n] < 15)
						{
							count += 1;
						}
					};

					if (count != player_data[i].data.length)
					{
						series_data.push(player_data[i]);
					}
				};

				var game_data = {};

				for (var i = 0; i < games.length; i++) 
				{
					game_data[games[i][0].date] = {};

				 	game_data[games[i][0].date]['espn_link'] = games[i][0].url_espn;
				 	game_data[games[i][0].date]['team1'] = games[i][0].team1;
				 	game_data[games[i][0].date]['score1'] = games[i][0].score1;
				 	game_data[games[i][0].date]['team2'] = games[i][0].team2;
				 	game_data[games[i][0].date]['score2'] = games[i][0].score2;

				 	var pm_date = games[i][0].date.replace(/-/g,'');

				 	var pm_team1 = change_abbr_for_pm(games[i][0].team1);
				 	var pm_team2 = change_abbr_for_pm(games[i][0].team2);

				 	game_data[games[i][0].date]['pm_link'] = 'http://popcornmachine.net/cgi-bin/gameflow.cgi?date='+pm_date+'&game='+pm_team1+pm_team2;
				};

		        $('.team-rotation-line-chart').highcharts({
		            chart: {
		                type: 'line'
		            },
		            title: {
		                text: options['chosen_team']+' Rotations '+options['starters-toggle-headline']
		            },
		            xAxis: {
		                categories: rotation_dates,
			            labels: {
			                formatter: function() {
			                    return this.value+'<br>'+game_data[this.value]['team1']+' '+game_data[this.value]['score1']+', '+game_data[this.value]['team2']+' '+game_data[this.value]['score2']+'<br><a target="_blank" href="'+game_data[this.value]['espn_link']+'">ESPN</a><br><a target="_blank" href="'+game_data[this.value]['pm_link']+'">PM</a>';
			                },
			                useHTML: true
			            }
		            },
	                yAxis: {
	                    title: {
	                        text: 'Minutes'
	                    },
	                    tickInterval: 5,
                    	tickPixelInterval: 400,
                    	min: 0
	                },

		            series: series_data
		        });
            }	
		}); 				
	}

	function show_or_hide_rows()
	{
		$('.show-row').show();
		$('.hide-row').hide();			
	}

	function change_abbr_for_pm(team_abbr)
	{
		switch(team_abbr)
		{
			case 'GS':
				return 'GSW';
			case 'NO':
				return 'NOR';
			case 'NY':
				return 'NYK';
			case 'PHX':
				return 'PHO';
			case 'SA':
				return 'SAS';
			case 'UTAH':
				return 'UTH';
			case 'WSH':
				return 'WAS';
			default:
				return team_abbr;
		}
	}

	function change_abbr_for_rotoworld(team_abbr)
	{
		switch(team_abbr)
		{
			case 'LAL':
				return 'LAK';
			case 'MIL':
				return 'MLW';
			case 'PHX':
				return 'PHO';
			case 'UTAH':
				return 'UTA';
			case 'WSH':
				return 'WAS';
			default:
				return team_abbr;
		}
	}

	function get_starters_toggle_headline(value)
	{
		switch(value)
		{
			case 'only-starters':
				return '(Starters)';
			case 'only-bench':
				return '(Bench)';
			case 'starters-and-bench':
				return '(Starters and Bench)';
		}		
	}

	$('select[name=position-drop-down]').change(function() 
	{
		options_change();
	}); 

	$('.salary-input').on('input', function()
	{
		options_change();
	});

	$("input[name=salary-toggle]:radio").change(function () 
	{
		options_change();
	});

	$('select[name=team-drop-down]').change(function() 
	{
		var chosen_team = $('.team-drop-down').val();

		$(".chosen-team-rotation").hide();
		
		if (chosen_team == 'SA')
		{
			var two_teams = $(".show-game:contains("+chosen_team+"):not(:contains('SAC'))").text();	
		}
		else
		{
			var two_teams = $('.show-game:contains('+chosen_team+')').text();
		}

		var opposing_team = two_teams.replace(chosen_team+' vs ', '');
		opposing_team = opposing_team.replace(' vs '+chosen_team, '');
	
		var chosen_date = $('.date-drop-down option:selected').text();

    	$.ajax
	    ({
            url: 'http://localhost/dfsnbatools/daily/get_team_dvp/'+opposing_team+'/'+chosen_date,
            type: 'POST',
            dataType: 'json',
            success: function(dvp)
            {		
             	$(".dvp").html('<table class="inside-box"><tr><th>Opponent DvP</th><th>PG</th><th>PG-Mod</th><th>SG</th><th>SG-Mod</th><th>SF</th><th>SF-Mod</th><th>PF</th><th>PF-Mod</th><th>C</th><th>C-Mod</th></tr><tr><td>'+dvp[0].name_dvp+'</td><td class="rank">'+dvp[0].pg_rank+'</td><td>'+dvp[0].pg_rank_mod+'</td><td class="rank">'+dvp[0].sg_rank+'</td><td>'+dvp[0].sg_rank_mod+'</td><td class="rank">'+dvp[0].sf_rank+'</td><td>'+dvp[0].sf_rank_mod+'</td><td class="rank">'+dvp[0].pf_rank+'</td><td>'+dvp[0].pf_rank_mod+'</td><td class="rank">'+dvp[0].c_rank+'</td><td>'+dvp[0].c_rank_mod+'</td></tr></table>');
            }
        }); 
			
		options_change();
			
		$(".rotations-toggle").text("Show Rotations");
		$('#only-starters').prop('checked', true);

	}); 

	$("input[name=starters-toggle]:radio").change(function () 
	{
		var chosen_team = $('.team-drop-down').val();

		if (chosen_team != 'all')
		{
			var rotations_toggle_anchor_text = $(".rotations-toggle").text();

			if (rotations_toggle_anchor_text == 'Hide Rotations')
			{
				show_or_update_rotations();
			}

			options_change();
		}
	});

	$(".rotations-toggle").click(function(event)
	{
		event.preventDefault();

		var rotations_toggle_anchor_text = $(".rotations-toggle").text();

		if (rotations_toggle_anchor_text == 'Show Rotations')
		{
			$(".rotations-toggle").text('Hide Rotations');

			show_or_update_rotations();

			$(".chosen-team-rotation").show();
		}
		else if (rotations_toggle_anchor_text == 'Hide Rotations')
		{
			$(".rotations-toggle").text('Show Rotations');
			$(".chosen-team-rotation").hide();
		}
	});

	$('.salary-reset').click(function() 
	{
		$('.salary-input').val('');
		$('#greater-than').prop('checked', true);

		options_change();
	});

	$('.game-button').click(function() 
	{
		$('.team-drop-down').val('all');

		var two_teams = $(this).text();

		var team = get_teams_in_game(two_teams);

        if ($(this).hasClass('hide-game'))
        {
			show_hide_team_drop_down_options('show', team);

			$(this).addClass('show-game');
            $(this).removeClass('hide-game');                                                
        } 
        else if ($(this).hasClass('show-game'))
        {
			show_hide_team_drop_down_options('hide', team);

			$(this).addClass('hide-game');
            $(this).removeClass('show-game');
        }

		options_change();
	});
});