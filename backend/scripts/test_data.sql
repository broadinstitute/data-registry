insert into users(user_name, password, created_at)  values ('admin', '$2b$12$egUzuU2ajc422dCG6Qoow.6xVrm5bix/04hShnnwjYpmRgEDAUqeu', NOW());
set @admin_user_id = LAST_INSERT_ID();
insert into users(user_name, password, created_at)  values ('reviewer', '$2b$12$egUzuU2ajc422dCG6Qoow.6xVrm5bix/04hShnnwjYpmRgEDAUqeu', NOW());
set @reviewer_user_id = LAST_INSERT_ID();
insert into users(user_name, password, created_at)  values ('uploader1', '$2b$12$egUzuU2ajc422dCG6Qoow.6xVrm5bix/04hShnnwjYpmRgEDAUqeu', NOW());
set @uploader1_id = LAST_INSERT_ID();
insert into users(user_name, password, created_at)  values ('uploader2', '$2b$12$egUzuU2ajc422dCG6Qoow.6xVrm5bix/04hShnnwjYpmRgEDAUqeu', NOW());
set @uploader2_id = LAST_INSERT_ID();


INSERT INTO roles(role) VALUES('reviewer');
SET @reviewer_role_id = LAST_INSERT_ID();

INSERT INTO roles(role) VALUES('uploader');
SET @uploader_role_id = LAST_INSERT_ID();


insert into permissions(permission) values ('approveUpload');
set @approve_upload_id = LAST_INSERT_ID();

insert into permissions(permission) values ('addUser');
set @add_user_id = LAST_INSERT_ID();

insert into permissions(permission) values ('deleteDataSet');
set @delete_dataset_id = LAST_INSERT_ID();

insert into role_permissions(permission_id, role_id) values (@approve_upload_id, @reviewer_role_id);
insert into role_permissions(permission_id, role_id) values (@add_user_id, @reviewer_role_id);
insert into role_permissions(permission_id, role_id) values (@delete_dataset_id, @reviewer_role_id);

insert into user_roles(user_id, role_id) values (@uploader1_id, @uploader_role_id);
insert into user_roles(user_id, role_id) values (@uploader2_id, @uploader_role_id);
insert into user_roles(user_id, role_id) values (@reviewer_user_id, @reviewer_role_id);
-- admin role id is created via migrations
insert into user_roles(user_id, role_id) values (@admin_user_id, 1);

insert into `groups`(group_name) values ('hermes');
SET @hermes_group_id = LAST_INSERT_ID();
insert into user_groups(group_id, user_id) values (@hermes_group_id, @reviewer_user_id);
insert into user_groups(group_id, user_id) values (@hermes_group_id, @uploader1_id);
insert into user_groups(group_id, user_id) values (@hermes_group_id, @uploader2_id);

INSERT INTO `file_uploads` VALUES (_binary 'bd7c52ed9d4344c2b540385f94ed5cde','Cypress dataset','sample-gwas.csv',14232496,'2024-06-03 15:13:12','uploader1','{\"cases\": 1000, \"dataset\": \"Cypress dataset\", \"controls\": 100, \"subjects\": 100, \"phenotype\": \"T1D\", \"column_map\": {\"alt\": \"OA\", \"eaf\": \"EAF\", \"beta\": \"BETA\", \"pValue\": \"P\", \"stdErr\": \"SE\", \"position\": \"BP\", \"reference\": \"EA\", \"chromosome\": \"CHR\"}, \"dichotomous\": 1, \"original_data\": \"sample-gwas.csv\"}','hermes/Cypress dataset','READY FOR REVIEW','R version 4.3.3 (2024-02-29) -- \"Angel Food Cake\"\nCopyright (C) 2024 The R Foundation for Statistical Computing\nPlatform: x86_64-pc-linux-gnu (64-bit)\nR is free software and comes with ABSOLUTELY NO WARRANTY.\nYou are welcome to redistribute it under certain conditions.\nType \'license()\' or \'licence()\' for distribution details.\n  Natural language support but running in an English locale\nR is a collaborative project with many contributors.\nType \'contributors()\' for more information and\n\'citation()\' on how to cite R or R packages in publications.\nType \'demo()\' for some demos, \'help()\' for on-line help, or\n\'help.start()\' for an HTML browser interface to help.\nType \'q()\' to quit R.\n> \n>     library(\'genepi.utils\')\n>     library(data.table)\nAttaching package: ‘data.table’\nThe following object is masked from ‘package:genepi.utils’:\n    as.data.table\nLoading GWAS ...\n>     GWAS(\'sample-gwas.csv\', c(\'CHR\',\'BP\',\'OA\',\'EA\',\'EAF\',\'BETA\',\'SE\',\'P\',\'EUR_EAF\',\'SNP\'))\n[i] loading data from: sample-gwas.csv\n[i] applying column mapping\n[i] enforcing column types\n[i] standardising columns\n	[i] 4300 invalid chromosome codings e.g. \'X\', attempting recoding...\n[i] standardising allele coding\n[i] applying filters\n	[-] 2 row warning(s) with filter \'eaf_invalid\' [eaf > 0 & eaf < 1]\n	[-] 23296 row warning(s) with filter \'alleles_invalid\' [!is.na(ea) & !is.na(oa)]\n[i] checking rsid coding\n	[?] 100000 rsids could not be parsed, setting to chr:bp\n<genepi.utils::GWAS>\n @ map        : <genepi.utils::ColumnMap>\n .. @ map:List of 9\n .. .. $ chr : <genepi.utils::Column>\n .. ..  ..@ name : chr \"chr\"\n .. ..  ..@ alias: chr [1:3] \"CHR\" \"chr\" \"chromosome\"\n .. ..  ..@ type : chr \"character\"\n .. .. $ bp  : <genepi.utils::Column>\n .. ..  ..@ name : chr \"bp\"\n .. ..  ..@ alias: chr [1:4] \"BP\" \"bp\" \"POS\" \"position\"\n .. ..  ..@ type : chr \"integer\"\n .. .. $ oa  : <genepi.utils::Column>\n .. ..  ..@ name : chr \"oa\"\n .. ..  ..@ alias: chr [1:8] \"OA\" \"oa\" \"A2\" \"Allele2\" ...\n .. ..  ..@ type : chr \"character\"\n .. .. $ ea  : <genepi.utils::Column>\n .. ..  ..@ name : chr \"ea\"\n .. ..  ..@ alias: chr [1:7] \"EA\" \"ea\" \"A1\" \"Allele1\" ...\n .. ..  ..@ type : chr \"character\"\n .. .. $ eaf : <genepi.utils::Column>\n .. ..  ..@ name : chr \"eaf\"\n .. ..  ..@ alias: chr [1:5] \"EAF\" \"eaf\" \"Freq1\" \"A1FREQ\" ...\n .. ..  ..@ type : chr \"numeric\"\n .. .. $ beta: <genepi.utils::Column>\n .. ..  ..@ name : chr \"beta\"\n .. ..  ..@ alias: chr [1:3] \"BETA\" \"beta\" \"Effect\"\n .. ..  ..@ type : chr \"numeric\"\n .. .. $ se  : <genepi.utils::Column>\n .. ..  ..@ name : chr \"se\"\n .. ..  ..@ alias: chr [1:3] \"SE\" \"se\" \"StdErr\"\n .. ..  ..@ type : chr \"numeric\"\n .. .. $ p   : <genepi.utils::Column>\n .. ..  ..@ name : chr \"p\"\n .. ..  ..@ alias: chr [1:5] \"P\" \"p\" \"P-value\" \"p-value\" ...\n .. ..  ..@ type : chr \"numeric\"\n .. .. $ rsid: <genepi.utils::Column>\n .. ..  ..@ name : chr \"rsid\"\n .. ..  ..@ alias: chr [1:6] \"SNP\" \"rsid\" \"RSID\" \"MarkerName\" ...\n .. ..  ..@ type : chr \"character\"\n @ qc         :List of 12\n .. $ !is.infinite(beta) & abs(beta) < 20: int(0) \n .. $ eaf > 0 & eaf < 1                  : int [1:2] 33879 47291\n .. $ !is.infinite(p)                    : int(0) \n .. $ !is.infinite(se)                   : int(0) \n .. $ !is.na(ea) & !is.na(oa)            : int [1:23296] 2 23 31 32 43 50 65 67 77 83 ...\n .. $ !is.na(chr)                        : int(0) \n .. $ !is.na(bp)                         : int(0) \n .. $ !is.na(beta)                       : int(0) \n .. $ !is.na(se)                         : int(0) \n .. $ !is.na(p)                          : int(0) \n .. $ !is.na(eaf)                        : int(0) \n .. $ fail                               : int [1:23298] 33879 47291 2 23 31 32 43 50 65 67 ...\n @ rsid       : chr [1:100000] \"21:87788038\" \"16:135111234\" \"15:9155552\" ...\n @ chr        : chr [1:100000] \"21\" \"16\" \"15\" \"9\" \"8\" \"19\" \"12\" \"2\" \"17\" \"1\" \"17\" ...\n @ bp         : int [1:100000] 87788038 135111234 9155552 149606450 88117155 57505828 151567917 21892485 184732773 65811819 ...\n @ ea         : chr [1:100000] \"A\" NA \"C\" \"G\" \"G\" \"A\" \"A\" \"A\" \"T\" \"G\" \"G\" \"A\" \"C\" \"A\" ...\n @ oa         : chr [1:100000] \"C\" NA \"A\" \"C\" \"C\" \"G\" \"G\" \"T\" \"C\" \"T\" \"A\" \"C\" \"T\" \"G\" ...\n @ eaf        : num [1:100000] 0.496 0.71 0.289 0.677 0.414 ...\n @ beta       : num [1:100000] -1.573 1.23 0.428 -0.271 -0.744 ...\n @ se         : num [1:100000] 0.252 0.824 0.681 0.351 0.925 ...\n @ p          : num [1:100000] 0.00938 0.08343 0.72352 0.00367 0.75452 ...\n @ n          : int NA\n @ ncase      : int NA\n @ strand     : chr NA\n @ imputed    : logi NA\n @ info       : num NA\n @ correlation: logi [1, 1] NA\n @ trait      : chr \"trait\"\n @ id         : chr \"id\"\n @ source     : chr \"sample-gwas.csv\"\n>     \n>     p <- qq_plot(\'sample-gwas.csv\', plot_corrected=TRUE)\n>     png(\"qq_plot.png\", width=600, height=600, units=\"px\")\n>     p\n>     dev.off()\nnull device \n          1 \n>     dt <- fread(\'sample-gwas.csv\')\n>     setnames(dt, tolower(names(dt)))\n>     manhattan_data <- manhattan(dt)\n>     png(\"manhattan_plot.png\", width=600, height=600, units=\"px\")\n>     manhattan_data\n>     dev.off()\nnull device \n          1 \n>     \n> \n> ', JSON_OBJECT('fd', .2, 'adj', 'lambda'));


