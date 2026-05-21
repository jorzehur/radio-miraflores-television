<?php
/**
 * Plugin Name: Radio Miraflores API
 * Plugin URI: https://radiomiraflores.com
 * Description: Custom API endpoints and CORS support for Radio Miraflores Televisión headless CMS. Includes CPTs for Ranking and Programación.
 * Version: 2.0.0
 * Author: Radio Miraflores
 * Text Domain: radio-miraflores-api
 */

if (!defined('ABSPATH')) exit;

// ============================================================
// 1. CUSTOM POST TYPES
// ============================================================

function rmtv_register_ranking_cpt() {
    register_post_type('ranking', [
        'labels' => [
            'name' => 'Ranking',
            'singular_name' => 'Canción',
            'add_new_item' => 'Añadir nueva canción',
            'edit_item' => 'Editar canción',
            'all_items' => 'Todas las canciones',
            'search_items' => 'Buscar canción',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'ranking',
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-format-audio',
        'menu_position' => 5,
    ]);
}
add_action('init', 'rmtv_register_ranking_cpt');

function rmtv_register_programacion_cpt() {
    register_post_type('programacion', [
        'labels' => [
            'name' => 'Programación',
            'singular_name' => 'Programa',
            'add_new_item' => 'Añadir nuevo programa',
            'edit_item' => 'Editar programa',
            'all_items' => 'Todos los programas',
            'search_items' => 'Buscar programa',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'programacion',
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-schedule',
        'menu_position' => 6,
    ]);
}
add_action('init', 'rmtv_register_programacion_cpt');

// ============================================================
// 2. META FIELDS FOR RANKING
// ============================================================

function rmtv_register_ranking_meta() {
    register_post_meta('ranking', 'position', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'integer',
        'default' => 0,
    ]);
    register_post_meta('ranking', 'song', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => '',
    ]);
    register_post_meta('ranking', 'artist', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => '',
    ]);
    register_post_meta('ranking', 'album', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => '',
    ]);
    register_post_meta('ranking', 'weeks', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'integer',
        'default' => 0,
    ]);
    register_post_meta('ranking', 'trend', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => 'same',
    ]);
    register_post_meta('ranking', 'cover_image', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => '',
    ]);
}
add_action('init', 'rmtv_register_ranking_meta');

// ============================================================
// 3. META FIELDS FOR PROGRAMACIÓN
// ============================================================

function rmtv_register_programacion_meta() {
    register_post_meta('programacion', 'horario', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => '',
    ]);
    register_post_meta('programacion', 'conductor', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => '',
    ]);
    register_post_meta('programacion', 'dia', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => '',
    ]);
}
add_action('init', 'rmtv_register_programacion_meta');

// ============================================================
// 4. ADMIN META BOX FOR RANKING
// ============================================================

function rmtv_ranking_meta_box() {
    add_meta_box('ranking_details', 'Detalles del Ranking', 'rmtv_ranking_meta_box_html', 'ranking', 'normal', 'high');
}
add_action('add_meta_boxes', 'rmtv_ranking_meta_box');

function rmtv_ranking_meta_box_html($post) {
    $position = get_post_meta($post->ID, 'position', true);
    $song = get_post_meta($post->ID, 'song', true);
    $artist = get_post_meta($post->ID, 'artist', true);
    $album = get_post_meta($post->ID, 'album', true);
    $weeks = get_post_meta($post->ID, 'weeks', true);
    $trend = get_post_meta($post->ID, 'trend', true);
    wp_nonce_field('rmtv_save_ranking', 'rmtv_ranking_nonce');
    ?>
    <p><label>Posición: <input type="number" name="position" value="<?php echo esc_attr($position); ?>" /></label></p>
    <p><label>Canción: <input type="text" name="song" value="<?php echo esc_attr($song); ?>" style="width:100%" /></label></p>
    <p><label>Artista: <input type="text" name="artist" value="<?php echo esc_attr($artist); ?>" style="width:100%" /></label></p>
    <p><label>Álbum: <input type="text" name="album" value="<?php echo esc_attr($album); ?>" style="width:100%" /></label></p>
    <p><label>Semanas en ranking: <input type="number" name="weeks" value="<?php echo esc_attr($weeks); ?>" /></label></p>
    <p><label>Tendencia:
        <select name="trend">
            <option value="up" <?php selected($trend, 'up'); ?>>↑ Subiendo</option>
            <option value="down" <?php selected($trend, 'down'); ?>>↓ Bajando</option>
            <option value="same" <?php selected($trend, 'same'); ?>>→ Igual</option>
        </select>
    </label></p>
    <?php
}

function rmtv_save_ranking_meta($post_id) {
    if (!isset($_POST['rmtv_ranking_nonce']) || !wp_verify_nonce($_POST['rmtv_ranking_nonce'], 'rmtv_save_ranking')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    $fields = ['position', 'song', 'artist', 'album', 'weeks', 'trend'];
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post_ranking', 'rmtv_save_ranking_meta');

// ============================================================
// 5. CORS HEADERS - V2 with full support for ngrok
// ============================================================

function rmtv_add_cors_headers() {
    $origin = get_http_origin();
    
    // Allow all origins for development (ngrok, preview domains, localhost)
    // In production, you should restrict this to your actual domain
    if ($origin) {
        header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
    } else {
        header('Access-Control-Allow-Origin: *');
    }
    
    // CRITICAL: Include ngrok-skip-browser-warning in allowed headers
    // This header is needed to bypass ngrok's browser warning page
    header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Disposition, Content-MD5, Content-Type, ngrok-skip-browser-warning, Accept, Origin, X-Requested-With');
    
    header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, PATCH, DELETE');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages, Link');
    header('Access-Control-Max-Age: 86400');
    header('Vary: Origin');
}
add_action('rest_api_init', 'rmtv_add_cors_headers', 15);

// Handle CORS preflight OPTIONS requests
function rmtv_handle_preflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        rmtv_add_cors_headers();
        status_header(200);
        exit();
    }
}
add_action('init', 'rmtv_handle_preflight', 1);

// Also add headers for non-REST API requests
function rmtv_add_cors_to_all() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if ($origin) {
        header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
    }
    header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, ngrok-skip-browser-warning, Accept, Origin');
    header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, PATCH, DELETE');
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
add_action('send_headers', 'rmtv_add_cors_to_all');

// ============================================================
// 6. SAMPLE DATA - Only creates on first activation
// ============================================================

function rmtv_create_sample_data() {
    // Check if sample data already exists
    $existing = get_posts(['post_type' => 'ranking', 'posts_per_page' => 1]);
    if (!empty($existing)) return; // Already has data
    
    $rankings = [
        ['position' => 1, 'song' => 'Bohemian Rhapsody', 'artist' => 'Queen', 'album' => 'A Night at the Opera', 'weeks' => 12, 'trend' => 'up'],
        ['position' => 2, 'song' => 'Hotel California', 'artist' => 'Eagles', 'album' => 'Hotel California', 'weeks' => 8, 'trend' => 'up'],
        ['position' => 3, 'song' => 'Stairway to Heaven', 'artist' => 'Led Zeppelin', 'album' => 'Led Zeppelin IV', 'weeks' => 15, 'trend' => 'same'],
        ['position' => 4, 'song' => "Sweet Child O' Mine", 'artist' => "Guns N' Roses", 'album' => 'Appetite for Destruction', 'weeks' => 6, 'trend' => 'up'],
    ];
    
    foreach ($rankings as $r) {
        $post_id = wp_insert_post([
            'post_title' => $r['song'] . ' - ' . $r['artist'],
            'post_type' => 'ranking',
            'post_status' => 'publish',
        ]);
        if ($post_id) {
            update_post_meta($post_id, 'position', $r['position']);
            update_post_meta($post_id, 'song', $r['song']);
            update_post_meta($post_id, 'artist', $r['artist']);
            update_post_meta($post_id, 'album', $r['album']);
            update_post_meta($post_id, 'weeks', $r['weeks']);
            update_post_meta($post_id, 'trend', $r['trend']);
        }
    }
    
    $programas = [
        ['title' => 'Rock al Amanecer', 'horario' => '06:00 - 09:00', 'conductor' => 'DJ Carlos', 'dia' => 'Lunes a Viernes'],
        ['title' => 'Tarde de Clásicos', 'horario' => '15:00 - 18:00', 'conductor' => 'María Fernanda', 'dia' => 'Lunes a Viernes'],
        ['title' => 'Noche de Rock', 'horario' => '21:00 - 00:00', 'conductor' => 'DJ Rocko', 'dia' => 'Sábado'],
    ];
    
    foreach ($programas as $p) {
        $post_id = wp_insert_post([
            'post_title' => $p['title'],
            'post_type' => 'programacion',
            'post_status' => 'publish',
        ]);
        if ($post_id) {
            update_post_meta($post_id, 'horario', $p['horario']);
            update_post_meta($post_id, 'conductor', $p['conductor']);
            update_post_meta($post_id, 'dia', $p['dia']);
        }
    }
}
register_activation_hook(__FILE__, 'rmtv_create_sample_data');

// ============================================================
// 7. CONNECTION TEST ENDPOINT
// ============================================================

add_action('rest_api_init', function() {
    register_rest_route('rmtv/v1', '/test', [
        'methods' => 'GET',
        'callback' => function() {
            return [
                'status' => 'connected',
                'plugin_version' => '2.0.0',
                'wordpress_url' => get_site_url(),
                'ranking_count' => wp_count_posts('ranking')->publish,
                'posts_count' => wp_count_posts('post')->publish,
                'cors_enabled' => true,
                'timestamp' => current_time('mysql'),
            ];
        },
        'permission_callback' => '__return_true',
    ]);
});
