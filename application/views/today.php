<div class="main">
	
	<div class="main-inner">

	    <div class="container">

      	  <div class="row">

      	  	<div class="span12">
	      	  	<h2><?php echo $h2_tag; ?></h2>
	      	  	<p>Advanced DFS Stats</p>
	      	</div>

      	  </div>

      	  <div class="row">
	
		  	<div class="span12">

				<div class="widget widget-table">

					<div class="widget-header">
						<h3><i class="fa fa-users"></i> Stats</h3>
					</div> <!-- /widget-header -->
					
					<div class="widget-content">

						<table id='simple-table3' class="table table-bordered table-striped">
							
							<thead>
								<tr>
									<th data-sort='string'>Name</th>
									<th data-sort='string'>Opp</th>
									<th data-sort='string'>Line</th>
									<th data-sort='float'>FPTS +/-</th>
									<th data-sort='int'>Salary</th>

									<th data-sort='int'>GP</th>
									<th data-sort='float'>MPG</th>
									<th data-sort='float'>FPPG</th>
									<th data-sort='float'>CV</th>
									<th data-sort='float'>VR</th>

									<th data-sort='float'>Last 15 Days MPG</th>
									<!--
									<th data-sort='int'>Last 15 GP</th>
									
									<th data-sort='float'>FPPG</th>
									<th data-sort='float'>CV</th>
									<th data-sort='float'>VR</th>

									<th data-sort='int'>Last Game MIN</th>
									<th data-sort='float'>FPTS</th>
									<th data-sort='float'>VR</th>
									-->
								</tr>
							</thead>

							<tbody>
								
									<?php 

									foreach ($players as $player) 
									{
										echo '<tr>';

											echo '<td>'.$player['name_team_position'].'</td>';
											echo '<td>'.$player['opponent'].'</td>';
											echo '<td>'.$player['line'].'</td>';
											echo '<td>'.$player['fpts_plus_minus'].'</td>';
											echo '<td>'.$player['salary'].'</td>';

											echo '<td>'.$player['gp_2013'].'</td>';
											echo '<td>'.$player['mpg_2013'].'</td>';
											echo '<td>'.$player['fppg_2013'].'</td>';
											echo '<td>'.$player['cv_2013'].'</td>';
											echo '<td>'.$player['vr_2013'].'</td>';

											echo '<td>'.$player['mpg_last_15_days'].'</td>';

											# echo '<td>'.$player['gp_last_15_days'].'</td>';

											# echo '<td>'.$player['fppg_last_15_days'].'</td>';
											# echo '<td>'.$player['cv_last_15_days'].'</td>';
											# echo '<td>'.$player['vr_last_15_days'].'</td>';

											# echo '<td>'.$player['mpg_last_game'].'</td>';
											# echo '<td>'.$player['fppg_last_game'].'</td>';
											# echo '<td>'.$player['vr_last_game'].'</td>';

										echo '</tr>';
									} 

									?> 
								
							</tbody>
						
						</table>

					</div>

				</div>

			</div>

		  </div>

      	  <div class="row">
	
		  	<div class="span6">

				<div class="widget widget-table">

					<div class="widget-header">
						<h3><i class="fa fa-crosshairs"></i> Games With Lines</h3>
					</div> <!-- /widget-header -->
					
					<div class="widget-content">

						<table id='simple-table' class="table table-bordered table-striped">
							
							<thead>
								<tr>
									<th data-sort='string'>Team</th>
									<th data-sort='string'>Opponent</th>
									<th data-sort='float'>FPTS +/-</th>
								</tr>
							</thead>

							<tbody>
								
									<?php 

									foreach ($matchups['has_lines'] as $game) 
									{
										for ($i = 1; $i <= 2; $i++) 
										{
											if ($i == 1) { $opp = 2; }
											if ($i == 2) { $opp = 1; }

											echo '<tr>';

											echo '<td>'.$game['team_abbr'.$i].'</td>';
											if ($opp == 2) { $home_game = '@'; } else { $home_game = ''; }
											echo '<td>'.$home_game.$game['team_abbr'.$opp].'</td>';
											echo '<td>'.$game['fpts_plus_minus'.$i].'</td>';

											echo '</tr>';
										}	
									}

									?> 
								
							</tbody>
						
						</table>

					</div>

				</div>

			</div>

		  	<div class="span6">

				<div class="widget widget-table">

					<div class="widget-header">
						<h3><i class="fa fa-crosshairs"></i> Games Without Lines</h3>
					</div> <!-- /widget-header -->
					
					<div class="widget-content">

						<table id='simple-table2' class="table table-bordered table-striped">
							
							<thead>
								<tr>
									<th data-sort='string'>Team</th>
									<th data-sort='string'>Opponent</th>
									<th data-sort='float'>FPTS +/-</th>
								</tr>
							</thead>

							<tbody>
								
									<?php 

									if (empty($matchups['no_lines']) === false)
									{
										foreach ($matchups['no_lines'] as $game) 
										{
											for ($i = 1; $i <= 2; $i++) 
											{
												if ($i == 1) { $opp = 2; }
												if ($i == 2) { $opp = 1; }

												echo '<tr>';

												echo '<td>'.$game['team_abbr'.$i].'</td>';
												if ($opp == 2) { $home_game = '@'; } else { $home_game = ''; }
												echo '<td>'.$home_game.$game['team_abbr'.$opp].'</td>';
												echo '<td>'.$game['fpts_plus_minus'.$i].'</td>';

												echo '</tr>';
											}	
										}
									}

									?> 
								
							</tbody>
						
						</table>

					</div> <!-- /widget-content -->

				</div> <!-- /widget -->

		    </div> <!-- /span -->

	      </div> <!-- /row -->

	    </div> <!-- /container -->
	    
	</div> <!-- /main-inner -->
    
</div> <!-- /main -->

