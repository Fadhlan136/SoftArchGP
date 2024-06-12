$(document).ready(function() {
    $('#searchButton').click(function() {
        var type = $('#typeSelect').val();
        var muscle = $('#muscleSelect').val();
        var difficulty = $('#difficultySelect').val();

        searchExercises(type, muscle, difficulty);
    });

    function searchExercises(type, muscle, difficulty) {
        var url = 'https://api.api-ninjas.com/v1/exercises?';
        
        if (type) {
            url += 'type=' + type + '&';
        }
        if (muscle) {
            url += 'muscle=' + muscle + '&';
        }
        if (difficulty) {
            url += 'difficulty=' + difficulty + '&';
        }

        $('#loading').removeClass('hidden');
        $('#exerciseList').empty();

        $.ajax({
            method: 'GET',
            url: url,
            headers: { 'X-Api-Key': '44iGWMrCN3cUutnGOOvvVQ==81p85e5W20vdAkDN' },
            success: function(result) {
                $('#loading').addClass('hidden');
                displayExercises(result);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#loading').addClass('hidden');
                console.error('Error: ', textStatus, errorThrown);
                $('#exerciseList').text('Failed to retrieve exercises.');
            }
        });
    }

    function displayExercises(result) {
        var exerciseList = $('#exerciseList');
        exerciseList.empty();

        if (!result || result.length === 0) {
            exerciseList.text('No exercises found.');
            return;
        }

        var ul = $('<ul>');
        result.forEach(function(exercise) {
            var li = $('<li>').html(`
                <strong>${exercise.name}</strong><br>
                <em>Type:</em> ${exercise.type}<br>
                <em>Muscle:</em> ${exercise.muscle}<br>
                <em>Difficulty:</em> ${exercise.difficulty}<br>
                <em>Equipment:</em> ${exercise.equipment}<br>
                <p>${exercise.instructions}</p>
            `);
            ul.append(li);
        });

        exerciseList.append(ul);
    }
});
