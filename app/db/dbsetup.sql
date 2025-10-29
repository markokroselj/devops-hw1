/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     27. 10. 2025 21:29:55                        */
/*==============================================================*/

/*CREATE DATABASE vehicles_db;*/
USE vehicles_db;


drop table if exists Vehicle;

drop table if exists Type;

drop table if exists Location;


/*==============================================================*/
/* Table: Location                                              */
/*==============================================================*/
create table Location
(
   Location_ID          int not null auto_increment,
   Location_name        varchar(100),
   primary key (Location_ID)
);

/*==============================================================*/
/* Table: Type                                                  */
/*==============================================================*/
create table Type
(
   Type_ID              int not null auto_increment,
   Type                 varchar(25),
   primary key (Type_ID)
);

/*==============================================================*/
/* Table: Vehicle                                               */
/*==============================================================*/
create table Vehicle
(
   Vehicle_ID           int not null auto_increment,
   Location_ID          int not null,
   Type_ID              int not null,
   Name                 varchar(20),
   primary key (Vehicle_ID)
);

alter table Vehicle add constraint FK_is foreign key (Type_ID)
      references Type (Type_ID) on delete restrict on update restrict;

alter table Vehicle add constraint FK_is_at foreign key (Location_ID)
      references Location (Location_ID) on delete restrict on update restrict;
      
/*Insert initial types and locations */     
insert into Type (Type) values ('Ship'), ('Booster');
insert into Location (Location_name) values ('Production site'), ('Launch site');