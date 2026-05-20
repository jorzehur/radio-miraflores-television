<?php
/**
 * Plugin Name: Radio Miraflores API
 * Plugin URI: https://github.com/jorzehur/radio-miraflores-television
 * Description: Custom API endpoints, Custom Post Types y campos ACF para Radio Miraflores Televisión - Conexión con Next.js Headless CMS
 * Version: 1.0.0
 * Author: Radio Miraflores Televisión
 * Author URI: https://github.com/jorzehur
 * License: GPL v2 or later
 * Text Domain: radio-miraflores-api
 */

if (!defined('ABSPATH')) {
    exit;
}

// ============================================================
// 1. REGISTRAR CUSTOM POST TYPES
// ============================================================

/**
 * CPT: Ranking Internacional
 */
function rmtv_register_ranking_cpt() {
    $labels = array(
        'name'               => 'Ranking Internacional',
        'singular_name'      => 'Posición del Ranking',
        'menu_name'          => '🏆 Ranking',
        'add_new'            => 'Agregar Posición',
        'add_new_item'       => 'Nueva Posición del Ranking',
        'edit_item'          => 'Editar Posición',
        'new_item'           => 'Nueva Posición',
        'view_item'          => 'Ver Posición',
        'search_items'       => 'Buscar en Ranking',
        'not_found'          => 'No se encontraron posiciones',
        'not_found_in_trash' => 'No hay posiciones en la papelera',
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'has_archive'         => true,
        'publicly_queryable'  => true,
        'show_in_rest'        => true, // Habilitar REST API
        'rest_base'           => 'ranking',
        'show_ui'             => true,
        'show_in_menu'        => true,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-awards',
        'supports'            => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite'             => array('slug' => 'ranking'),
    );

    register_post_type('ranking', $args);
}
add_action('init', 'rmtv_register_ranking_cpt');

/**
 * CPT: Programación
 */
function rmtv_register_programacion_cpt() {
    $labels = array(
        'name'               => 'Programación',
        'singular_name'      => 'Programa',
        'menu_name'          => '📻 Programación',
        'add_new'            => 'Agregar Programa',
        'add_new_item'       => 'Nuevo Programa',
        'edit_item'          => 'Editar Programa',
        'new_item'           => 'Nuevo Programa',
        'view_item'          => 'Ver Programa',
        'search_items'       => 'Buscar Programas',
        'not_found'          => 'No se encontraron programas',
        'not_found_in_trash' => 'No hay programas en la papelera',
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'has_archive'         => true,
        'publicly_queryable'  => true,
        'show_in_rest'        => true,
        'rest_base'           => 'programacion',
        'show_ui'             => true,
        'show_in_menu'        => true,
        'menu_position'       => 6,
        'menu_icon'           => 'dashicons-schedule',
        'supports'            => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite'             => array('slug' => 'programacion'),
    );

    register_post_type('programacion', $args);
}
add_action('init', 'rmtv_register_programacion_cpt');

// ============================================================
// 2. METABOXES PARA RANKING
// ============================================================

/**
 * Registrar meta fields para REST API (Ranking)
 */
function rmtv_register_ranking_meta() {
    $fields = array(
        'position' => array(
            'type'         => 'integer',
            'description'  => 'Posición en el ranking',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'song' => array(
            'type'         => 'string',
            'description'  => 'Nombre de la canción',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'artist' => array(
            'type'         => 'string',
            'description'  => 'Nombre del artista/banda',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'album' => array(
            'type'         => 'string',
            'description'  => 'Nombre del álbum',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'weeks' => array(
            'type'         => 'integer',
            'description'  => 'Semanas en el ranking',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'trend' => array(
            'type'         => 'string',
            'description'  => 'Tendencia: up, down, same',
            'single'       => true,
            'show_in_rest' => true,
        ),
    );

    foreach ($fields as $key => $args) {
        register_meta('post', $key, array_merge($args, array(
            'object_subtype' => 'ranking',
        )));
    }
}
add_action('init', 'rmtv_register_ranking_meta');

/**
 * Metabox HTML para Ranking
 */
function rmtv_ranking_metabox_html($post) {
    if ($post->post_type !== 'ranking') return;
    
    $position = get_post_meta($post->ID, 'position', true);
    $song     = get_post_meta($post->ID, 'song', true);
    $artist   = get_post_meta($post->ID, 'artist', true);
    $album    = get_post_meta($post->ID, 'album', true);
    $weeks    = get_post_meta($post->ID, 'weeks', true);
    $trend    = get_post_meta($post->ID, 'trend', true);
    ?>
    <div style="padding: 10px;">
        <p>
            <label><strong>Posición:</strong></label><br>
            <input type="number" name="rmtv_position" value="<?php echo esc_attr($position); ?>" min="1" style="width:100px;" />
        </p>
        <p>
            <label><strong>Canción:</strong></label><br>
            <input type="text" name="rmtv_song" value="<?php echo esc_attr($song); ?>" style="width:100%;" />
        </p>
        <p>
            <label><strong>Artista/Banda:</strong></label><br>
            <input type="text" name="rmtv_artist" value="<?php echo esc_attr($artist); ?>" style="width:100%;" />
        </p>
        <p>
            <label><strong>Álbum:</strong></label><br>
            <input type="text" name="rmtv_album" value="<?php echo esc_attr($album); ?>" style="width:100%;" />
        </p>
        <p>
            <label><strong>Semanas en ranking:</strong></label><br>
            <input type="number" name="rmtv_weeks" value="<?php echo esc_attr($weeks); ?>" min="0" style="width:100px;" />
        </p>
        <p>
            <label><strong>Tendencia:</strong></label><br>
            <select name="rmtv_trend">
                <option value="up" <?php selected($trend, 'up'); ?>>⬆️ Subiendo</option>
                <option value="same" <?php selected($trend, 'same'); ?>>(=) Sin cambio</option>
                <option value="down" <?php selected($trend, 'down'); ?>>⬇️ Bajando</option>
            </select>
        </p>
    </div>
    <?php
}

/**
 * Agregar metabox al CPT Ranking
 */
function rmtv_add_ranking_metabox() {
    add_meta_box(
        'rmtv_ranking_details',
        '🏆 Detalles del Ranking',
        'rmtv_ranking_metabox_html',
        'ranking',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'rmtv_add_ranking_metabox');

/**
 * Guardar datos del metabox Ranking
 */
function rmtv_save_ranking_meta($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (get_post_type($post_id) !== 'ranking') return;
    
    $fields = array(
        'rmtv_position' => 'position',
        'rmtv_song'     => 'song',
        'rmtv_artist'   => 'artist',
        'rmtv_album'    => 'album',
        'rmtv_weeks'    => 'weeks',
        'rmtv_trend'    => 'trend',
    );
    
    foreach ($fields as $form_key => $meta_key) {
        if (isset($_POST[$form_key])) {
            update_post_meta($post_id, $meta_key, sanitize_text_field($_POST[$form_key]));
        }
    }
}
add_action('save_post', 'rmtv_save_ranking_meta');

// ============================================================
// 3. METABOXES PARA PROGRAMACIÓN
// ============================================================

/**
 * Registrar meta fields para REST API (Programación)
 */
function rmtv_register_programacion_meta() {
    $fields = array(
        'dia' => array(
            'type'         => 'string',
            'description'  => 'Día de la semana',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'hora_inicio' => array(
            'type'         => 'string',
            'description'  => 'Hora de inicio',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'hora_fin' => array(
            'type'         => 'string',
            'description'  => 'Hora de fin',
            'single'       => true,
            'show_in_rest' => true,
        ),
        'locutor' => array(
            'type'         => 'string',
            'description'  => 'Nombre del locutor',
            'single'       => true,
            'show_in_rest' => true,
        ),
    );

    foreach ($fields as $key => $args) {
        register_meta('post', $key, array_merge($args, array(
            'object_subtype' => 'programacion',
        )));
    }
}
add_action('init', 'rmtv_register_programacion_meta');

/**
 * Metabox HTML para Programación
 */
function rmtv_programacion_metabox_html($post) {
    if ($post->post_type !== 'programacion') return;
    
    $dia        = get_post_meta($post->ID, 'dia', true);
    $hora_inicio = get_post_meta($post->ID, 'hora_inicio', true);
    $hora_fin   = get_post_meta($post->ID, 'hora_fin', true);
    $locutor    = get_post_meta($post->ID, 'locutor', true);
    ?>
    <div style="padding: 10px;">
        <p>
            <label><strong>Día:</strong></label><br>
            <select name="rmtv_dia">
                <option value="lunes" <?php selected($dia, 'lunes'); ?>>Lunes</option>
                <option value="martes" <?php selected($dia, 'martes'); ?>>Martes</option>
                <option value="miercoles" <?php selected($dia, 'miercoles'); ?>>Miércoles</option>
                <option value="jueves" <?php selected($dia, 'jueves'); ?>>Jueves</option>
                <option value="viernes" <?php selected($dia, 'viernes'); ?>>Viernes</option>
                <option value="sabado" <?php selected($dia, 'sabado'); ?>>Sábado</option>
                <option value="domingo" <?php selected($dia, 'domingo'); ?>>Domingo</option>
            </select>
        </p>
        <p>
            <label><strong>Hora de inicio:</strong></label><br>
            <input type="time" name="rmtv_hora_inicio" value="<?php echo esc_attr($hora_inicio); ?>" />
        </p>
        <p>
            <label><strong>Hora de fin:</strong></label><br>
            <input type="time" name="rmtv_hora_fin" value="<?php echo esc_attr($hora_fin); ?>" />
        </p>
        <p>
            <label><strong>Locutor:</strong></label><br>
            <input type="text" name="rmtv_locutor" value="<?php echo esc_attr($locutor); ?>" style="width:100%;" />
        </p>
    </div>
    <?php
}

function rmtv_add_programacion_metabox() {
    add_meta_box(
        'rmtv_programacion_details',
        '📻 Detalles del Programa',
        'rmtv_programacion_metabox_html',
        'programacion',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'rmtv_add_programacion_metabox');

function rmtv_save_programacion_meta($post_id) {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (get_post_type($post_id) !== 'programacion') return;
    
    $fields = array(
        'rmtv_dia'         => 'dia',
        'rmtv_hora_inicio' => 'hora_inicio',
        'rmtv_hora_fin'    => 'hora_fin',
        'rmtv_locutor'     => 'locutor',
    );
    
    foreach ($fields as $form_key => $meta_key) {
        if (isset($_POST[$form_key])) {
            update_post_meta($post_id, $meta_key, sanitize_text_field($_POST[$form_key]));
        }
    }
}
add_action('save_post', 'rmtv_save_programacion_meta');

// ============================================================
// 4. HABILITAR CORS PARA NEXT.JS
// ============================================================

function rmtv_enable_cors() {
    $origin = get_http_origin();
    $allowed_origins = array(
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    );
    
    // En desarrollo, permitir cualquier origen necesario
    $allow = false;
    if ($origin) {
        if (in_array($origin, $allowed_origins)) {
            $allow = true;
        }
        // Permitir dominios de preview (.space.chatglm.site, .space-z.ai)
        if (preg_match('/\.space\.chatglm\.site$|\.space-z\.ai$|\.chatglm\.site$/', $origin)) {
            $allow = true;
        }
        // Permitir cualquier localhost
        if (preg_match('/^https?:\/\/localhost/', $origin)) {
            $allow = true;
        }
        // Permitir ngrok tunnels
        if (preg_match('/\.ngrok-free\.dev$|\.ngrok\.io$|\.ngrok-free\.app$/', $origin)) {
            $allow = true;
        }
    }
    
    if ($allow) {
        header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, ngrok-skip-browser-warning');
        header('Access-Control-Allow-Credentials: true');
    }
    
    if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
}
add_action('rest_api_init', 'rmtv_enable_cors', 15);

// ============================================================
// 5. DATOS DE EJEMPLO (Solo al activar el plugin)
// ============================================================

function rmtv_activate_plugin() {
    // Crear categoría "Noticias"
    if (!term_exists('Noticias', 'category')) {
        wp_insert_term('Noticias', 'category', array(
            'slug' => 'noticias',
        ));
    }
    
    // Crear categoría "Ranking"
    if (!term_exists('Ranking', 'category')) {
        wp_insert_term('Ranking', 'category', array(
            'slug' => 'ranking',
        ));
    }
    
    // Crear posiciones de ranking de ejemplo
    $ranking_examples = array(
        array('position' => 1, 'song' => 'Bohemian Rhapsody', 'artist' => 'Queen', 'album' => 'A Night at the Opera', 'weeks' => 12, 'trend' => 'up'),
        array('position' => 2, 'song' => 'Hotel California', 'artist' => 'Eagles', 'album' => 'Hotel California', 'weeks' => 8, 'trend' => 'up'),
        array('position' => 3, 'song' => 'Stairway to Heaven', 'artist' => 'Led Zeppelin', 'album' => 'Led Zeppelin IV', 'weeks' => 15, 'trend' => 'same'),
        array('position' => 4, 'song' => "Sweet Child O' Mine", 'artist' => "Guns N' Roses", 'album' => 'Appetite for Destruction', 'weeks' => 6, 'trend' => 'up'),
    );
    
    foreach ($ranking_examples as $item) {
        // Check if already exists
        $existing = new WP_Query(array(
            'post_type'  => 'ranking',
            'meta_key'   => 'position',
            'meta_value' => $item['position'],
        ));
        
        if ($existing->found_posts === 0) {
            $post_id = wp_insert_post(array(
                'post_title'  => $item['song'] . ' - ' . $item['artist'],
                'post_type'   => 'ranking',
                'post_status' => 'publish',
            ));
            
            if ($post_id) {
                update_post_meta($post_id, 'position', $item['position']);
                update_post_meta($post_id, 'song', $item['song']);
                update_post_meta($post_id, 'artist', $item['artist']);
                update_post_meta($post_id, 'album', $item['album']);
                update_post_meta($post_id, 'weeks', $item['weeks']);
                update_post_meta($post_id, 'trend', $item['trend']);
            }
        }
    }
    
    // Crear noticias de ejemplo
    $noticias_examples = array(
        array(
            'title'   => '¡Estreno exclusivo! Entrevista con la banda de rock alternativo del momento',
            'content' => 'Esta noche a las 8:00 PM estrenamos entrevista exclusiva con la banda de rock alternativo que está revolucionando la escena musical. Prepárate para una noche llena de rock en vivo y sorpresas. ¡Sintoniza! #RockEnVivo #RadioMiraflores',
        ),
        array(
            'title'   => '¡Nuevo líder del Ranking Internacional! Bohemian Rhapsody vuelve al #1',
            'content' => '"Bohemian Rhapsody" de Queen vuelve a coronarse en el #1 de nuestro Ranking Internacional de Rock. ¿Estás de acuerdo con esta posición? ¡Comenta y comparte tu opinión! La voz de nuestros oyentes es lo que más importa #RankingRock #Queen',
        ),
    );
    
    foreach ($noticias_examples as $item) {
        $existing = new WP_Query(array(
            'post_type' => 'post',
            'title'     => $item['title'],
        ));
        
        if ($existing->found_posts === 0) {
            wp_insert_post(array(
                'post_title'   => $item['title'],
                'post_content' => $item['content'],
                'post_status'  => 'publish',
                'post_type'    => 'post',
            ));
        }
    }
    
    // Flush rewrite rules for CPTs
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'rmtv_activate_plugin');

/**
 * Flush rewrite rules on deactivation
 */
function rmtv_deactivate_plugin() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'rmtv_deactivate_plugin');

// ============================================================
// 6. ADMIN STYLES
// ============================================================

function rmtv_admin_styles() {
    echo '<style>
        #rmtv_ranking_details .inside,
        #rmtv_programacion_details .inside {
            margin: 0;
            padding: 0;
        }
    </style>';
}
add_action('admin_head', 'rmtv_admin_styles');
