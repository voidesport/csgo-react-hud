import React from "react";
import {Player} from "csgogsi-socket";
import Weapon from "../Weapon/Weapon";
import Avatar from "./Avatar";
import "./observed2.scss";
import {ArmorFull, ArmorHelmet, Bullets, HealthFull} from '../../assets/Icons';
import {Veto} from "../../api/interfaces";

export default class Observed extends React.Component<{ player: Player | null, veto: Veto | null, round: number }> {
	getAdr = () => {
		const { veto, player } = this.props;
		if (!player || !veto || !veto.rounds) return null;
		const damageInRounds = veto.rounds.map(round => round.players[player.steamid]).filter(data => !!data).map(roundData => roundData.damage);
		return damageInRounds.reduce((a, b) => a + b, 0) / (this.props.round - 1);
	}
	render() {
		if (!this.props.player) return '';
		const { player } = this.props;
		const weapons = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
		const currentWeapon = weapons.filter(weapon => weapon.state === "active")[0];
		const grenades = weapons.filter(weapon => weapon.type === "Grenade");

		return (
			<div className={`observed2 ${player.team.side}`}>
				<div className="main_row2">
					<div className="username_container">
						<div className="username">{player.name}</div>
					</div>
					<div className="whitespace">&nbsp;</div>
					<div className="health_armor_container">
						<div className="health text"><HealthFull />{player.state.health}</div>
						<div className="armor text">{player.state.helmet ? <ArmorHelmet /> : <ArmorFull />} {player.state.armor}</div>
					</div>
				</div>
				<div className="stats_row2">
					<div className="grenade_container">
						{grenades.map(grenade => <React.Fragment key={`${player.steamid}_${grenade.name}_${grenade.ammo_reserve || 1}`}>
							<Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />
							{ 
							grenade.ammo_reserve === 2 ? <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null }
						</React.Fragment>)}
					</div>
					<Avatar steamid={player.steamid} width={180} showCam={true} slot={player.observer_slot} default={player.team.side}/>
					<div className="ammo">
						<div className="ammo_icon_container">
							<Bullets />
							<div className="ammo_counter">
								<div className="ammo_clip">{(currentWeapon && currentWeapon.ammo_clip) || "-"}</div>
								<div className="ammo_reserve">/{(currentWeapon && currentWeapon.ammo_reserve) || "-"}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
