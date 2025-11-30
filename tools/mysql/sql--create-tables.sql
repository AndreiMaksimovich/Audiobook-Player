-- audiobooks.audiobooks definition

CREATE TABLE `audiobooks` (
                              `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                              `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                              `short_description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                              `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                              `version` bigint unsigned NOT NULL DEFAULT '1',
                              `total_size` bigint unsigned NOT NULL,
                              `total_duration` bigint unsigned NOT NULL,
                              `add_time` bigint unsigned NOT NULL,
                              `update_time` bigint unsigned NOT NULL,
                              PRIMARY KEY (`id`),
                              FULLTEXT KEY `audiobooks_title_IDX` (`title`,`description`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.authors definition

CREATE TABLE `authors` (
                           `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                           `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                           `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                           `parent_id` bigint unsigned NOT NULL DEFAULT '0',
                           PRIMARY KEY (`id`),
                           FULLTEXT KEY `authors_name_IDX` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.categories definition

CREATE TABLE `categories` (
                              `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                              `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                              `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                              `parent_id` bigint unsigned NOT NULL DEFAULT '0',
                              PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.media_files definition

CREATE TABLE `media_files` (
                               `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                               `file_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                               `owner_id` bigint unsigned NOT NULL,
                               `media_type` int unsigned NOT NULL,
                               `file_size` bigint unsigned NOT NULL,
                               `duration` bigint unsigned DEFAULT NULL,
                               `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                               `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                               `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                               `file_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                               `owner_index` int unsigned NOT NULL,
                               `owner_type` int unsigned NOT NULL,
                               PRIMARY KEY (`id`),
                               UNIQUE KEY `media_files__file_id` (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.readers definition

CREATE TABLE `readers` (
                           `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                           `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                           `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                           `parent_id` bigint unsigned NOT NULL DEFAULT '0',
                           PRIMARY KEY (`id`),
                           FULLTEXT KEY `readers_name_IDX` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.tags definition

CREATE TABLE `tags` (
                        `id` bigint unsigned NOT NULL AUTO_INCREMENT,
                        `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                        `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
                        `parent_id` bigint unsigned NOT NULL DEFAULT '0',
                        PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.audiobooks_to_authors definition

CREATE TABLE `audiobooks_to_authors` (
                                         `audiobook_id` bigint unsigned NOT NULL,
                                         `author_id` bigint unsigned NOT NULL,
                                         KEY `audiobooks_to_authors_audiobook_id_IDX` (`audiobook_id`) USING BTREE,
                                         KEY `audiobooks_to_authors_author_id_IDX` (`author_id`) USING BTREE,
                                         CONSTRAINT `audiobooks_to_authors_audiobooks_FK` FOREIGN KEY (`audiobook_id`) REFERENCES `audiobooks` (`id`),
                                         CONSTRAINT `audiobooks_to_authors_authors_FK` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.audiobooks_to_categories definition

CREATE TABLE `audiobooks_to_categories` (
                                            `audiobook_id` bigint unsigned NOT NULL,
                                            `category_id` bigint unsigned NOT NULL,
                                            KEY `audiobooks_to_categories_audiobook_id_IDX` (`audiobook_id`) USING BTREE,
                                            KEY `audiobooks_to_categories_category_id_IDX` (`category_id`) USING BTREE,
                                            CONSTRAINT `audiobooks_to_categories_audiobooks_FK` FOREIGN KEY (`audiobook_id`) REFERENCES `audiobooks` (`id`),
                                            CONSTRAINT `audiobooks_to_categories_categories_FK` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.audiobooks_to_readers definition

CREATE TABLE `audiobooks_to_readers` (
                                         `audiobook_id` bigint unsigned NOT NULL,
                                         `reader_id` bigint unsigned NOT NULL,
                                         KEY `audiobooks_to_readers_audiobook_id_IDX` (`audiobook_id`) USING BTREE,
                                         KEY `audiobooks_to_readers_reader_id_IDX` (`reader_id`) USING BTREE,
                                         CONSTRAINT `audiobooks_to_readers_audiobooks_FK` FOREIGN KEY (`audiobook_id`) REFERENCES `audiobooks` (`id`),
                                         CONSTRAINT `audiobooks_to_readers_readers_FK` FOREIGN KEY (`reader_id`) REFERENCES `readers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- audiobooks.audiobooks_to_tags definition

CREATE TABLE `audiobooks_to_tags` (
                                      `audiobook_id` bigint unsigned NOT NULL,
                                      `tag_id` bigint unsigned NOT NULL,
                                      KEY `audiobooks_to_tags_audiobook_id_IDX` (`audiobook_id`) USING BTREE,
                                      KEY `audiobooks_to_tags_tag_id_IDX` (`tag_id`) USING BTREE,
                                      CONSTRAINT `audiobooks_to_tags_audiobooks_FK` FOREIGN KEY (`audiobook_id`) REFERENCES `audiobooks` (`id`),
                                      CONSTRAINT `audiobooks_to_tags_tags_FK` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
